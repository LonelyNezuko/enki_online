const { Server } = require("socket.io")
let ioConnection = null

const ioConnectionsList = []

function ioStart(httpServer)
{
    ioConnection = new Server(httpServer)

    ioConnection.on('connection', socket =>
    {
        ioConnectionsList.push(socket)
        socket.on('disconnect', data =>
        {
            ioConnectionsList.splice(ioConnectionsList.indexOf(socket), 1)
            console.log('Отключение')
        })

        console.log('Подключение')

        socket.on('messages.new', data =>
        {
            require('../routes/io/messages').new(socket, data)
        })
    })

    console.log('Socket.io is connected')
}
const io = {
    emitAll: (eventName, data) =>
    {
        ioConnectionsList.forEach(item => item.emit(eventName, data))
    }
}
module.exports = { ioStart, io }

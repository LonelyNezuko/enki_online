const { io } = require('../../modules/io')

const messages = {
    new: (socket, data) =>
    {
        console.log(data)
        io.emitAll(`messages_${data.groupID}.new`, data)
    }
}

module.exports = messages

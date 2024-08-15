const _cef = {
    on: (eventName, callback) =>
    {
        if(global.cef) global.cef.on(eventName, callback)
        console.log(`CEF DEBUG .on: eventName(${eventName}); callback(${callback})`)
    },
    event: (eventName, args = '') =>
    {
        if(global.cef) global.cef.emit('client::event', eventName + ';' + args)
        console.log(`CEF DEBUG .event: eventName(${eventName}); args(${args})`)
    }
}

export default _cef
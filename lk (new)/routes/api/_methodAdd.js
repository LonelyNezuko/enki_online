const methods = {}
function methodAdd(methodName, func)
{
    methods[methodName] = func
}

module.exports = { methodAdd, methods }

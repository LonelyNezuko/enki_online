const secretKeys = {
    'Gbb1dnrDcMcjq35qkj1zkKqlKN1b9KKVPl840iHn': { // Лаунчер
        'server_getall_params[getPassword]': true,
        'account_joinLauncher': true
    }
}
function secretKeyCheck(key, attrs = '')
{
    if(!secretKeys[key])return false
    if(attrs.length
        && secretKeys[key][attrs] !== true)return false

    return true
}

module.exports = { secretKeyCheck }

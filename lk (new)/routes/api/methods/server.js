const { methodAdd } = require('../_methodAdd')
const { secretKeyCheck } = require('../_secretKeys.js')

const { modeHandle } = require('../../../modules/mysqlConnection')

const { modeMysqlConfig } = require('../../../bin/config_mysql')

methodAdd('server_getall', async (res, params, secret) =>
{
    const data = []
    let tempData = {}

    if(params.getPassword
        && !secret)return res.send({
            status: "error",
            result: 'params[getPassword]_need_secret_key'
        })
    if(params.getPassword
        && !secretKeyCheck(secret, 'server_getall_params[getPassword]'))return res.send({
            status: "error",
            result: 'you_cannot_use_params[getPassword]'
        })

    // if(params.withTest)
    // {
    //     tempData = {
    //         ip: modeMysqlConfig[0].ip,
    //         port: modeMysqlConfig[0].port,
    //         maxplayers: modeMysqlConfig[0].maxplayers,
    //
    //         players: 0,
    //         status: true,
    //         subname: '',
    //
    //         blocked: false
    //     }
    //
    //     let result = await modeHandle.query(0, 'select pID from players where pOnline != -1')
    //     tempData.players = result.length
    //
    //     result = await modeHandle.query(0, 'select serverOtherNames, serverPassword from other')
    //     tempData.subname = result[0]['serverOtherNames']
    //     tempData.blocked = parseInt(result[0]['serverPassword']) === 0 ? false : true
    //
    //     if(params.getPassword
    //         && tempData.blocked) tempData.password = result[0]['serverPassword']
    //
    //     data.push(tempData)
    // }

    tempData = {
        ip: modeMysqlConfig[0].ip,
        port: modeMysqlConfig[0].port,
        maxplayers: modeMysqlConfig[0].maxplayers,

        players: 0,
        status: true,
        subname: '',

        blocked: false
    }

    let result = await modeHandle.query(0, 'select pID from players where pOnline != -1')
    tempData.players = result.length

    result = await modeHandle.query(0, 'select serverOtherNames, serverPassword from other')
    tempData.subname = result[0]['serverOtherNames']
    tempData.blocked = parseInt(result[0]['serverPassword']) === 0 ? false : true

    if(params.getPassword
        && tempData.blocked) tempData.password = result[0]['serverPassword']

    data.push(tempData)
    return res.send({
        status: "success",
        result: data
    })
})
methodAdd('server_get', async (res, params, secret) =>
{
    const server = params.server
    if(!server)return res.send({
        status: "error",
        result: "params[server]_is_required_argument"
    })
    if(server < 0 || server >= modeMysqlConfig.length)return res.send({
        status: "error",
        result: "params[server]_invalid_value"
    })

    if(params.getPassword
        && !secret)return res.send({
            status: "error",
            result: 'params[getPassword]_need_secret_key'
        })
    if(params.getPassword
        && !secretKeyCheck(secret, 'server_getall_params[getPassword]'))return res.send({
            status: "error",
            result: 'you_cannot_use_params[getPassword]'
        })

    const data = {
        ip: modeMysqlConfig[server].ip,
        port: modeMysqlConfig[server].port,
        maxplayers: modeMysqlConfig[server].maxplayers,

        players: 0,
        status: true,
        subname: '',

        blocked: false
    }

    let result = await modeHandle.query(server, 'select pID from players where pOnline != -1')
    if(!result)return res.send({
        status: "error",
        result: "params[server]_invalid_value"
    })
    data.players = result.length

    result = await modeHandle.query(server, 'select serverOtherNames, serverPassword from other')
    data.subname = result[0]['serverOtherNames']
    data.blocked = parseInt(result[0]['serverPassword']) === 0 ? false : true

    if(params.getPassword
        && data.blocked) data.password = result[0]['serverPassword']

    return res.send({
        status: "success",
        result: data
    })
})

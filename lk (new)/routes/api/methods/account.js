const { methodAdd } = require('../_methodAdd')
const { secretKeyCheck } = require('../_secretKeys.js')

const { modeHandle } = require('../../../modules/mysqlConnection')

methodAdd('account_get', async (res, params) =>
{
    if(JSON.stringify(params) === '{}')return res.send({
        status: "error",
        result: "invalid_params"
    })

    const
        uid = params.uid,
        username = params.username,

        server = params.server

    if(!server)return res.send({
        status: "error",
        result: "params[server]_is_required_argument"
    })
    if(uid === undefined
        && !username)return res.send({
        status: "error",
        result: "params[uid]_or_params[username]_is_required_argument"
    })

    if(uid !== undefined
        && (isNaN(uid) || uid < 0))return res.send({
        status: "error",
        result: "params[uid]_invalid_value"
    })
    if(username
        && (typeof username !== 'string' || username.length < 4))return res.send({
        status: "error",
        result: "params[username]_invalid_value"
    })

    let account = await modeHandle.query(server, `select pID, pName, pSex, pAge, pRegDate, pLevel, pExp, pSkin, pCash, pOnline from players where ${uid !== undefined ? "pID" : "pName"} = ${modeHandle.format(uid !== undefined ? uid : username)}`)
    if(!account)return res.send({
        status: "error",
        result: "params[server]_invalid_value"
    })

    if(!account.length) account = {}
    else account = account[0]

    return res.send({
        status: "success",
        result: account
    })
})
methodAdd('account_joinLauncher', async (res, params, secret) =>
{
    if(JSON.stringify(params) === '{}')return res.send({
        status: "error",
        result: "invalid_params"
    })

    if(!secret)return res.send({
        status: "error",
        result: "secret_is_required_argument"
    })
    if(!secretKeyCheck(secret, 'account_joinLauncher'))return res.send({
        status: "error",
        result: "you_cannot_use_this_function"
    })

    const
        username = params.username,

        server = params.server,
        launcher = params.launcher

    if(!server)return res.send({
        status: "error",
        result: "params[server]_is_required_argument"
    })
    if(!username)return res.send({
        status: "error",
        result: "params[username]_is_required_argument"
    })
    if(!launcher)return res.send({
        status: "error",
        result: "params[launcher]_is_required_argument"
    })

    if(typeof username !== 'string' || username.length < 4)return res.send({
        status: "error",
        result: "params[username]_invalid_value"
    })
    if(isNaN(launcher)
        || launcher < 1 || launcher > 2)return res.send({
        status: "error",
        result: "params[launcher]_invalid_value"
    })

    const sm = await modeHandle.query(server, `delete from players_launcher where username = ${modeHandle.format(username)}`)
    if(!sm)return res.send({
        status: "error",
        result: "params[server]_invalid_value"
    })
    await modeHandle.query(server, `insert into players_launcher (username, launcher) values (${modeHandle.format(username)}, ${modeHandle.format(launcher)})`)

    return res.send({
        status: "success",
        result: ''
    })
})

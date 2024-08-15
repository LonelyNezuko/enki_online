const { dbhandleConfig, modeMysqlConfig } = require('../bin/config_mysql')
const mysql2 = require('mysql2/promise')

let dbhandleConnection = null
let modeHandleConnection = []

const dbhandle = {
    query: async str =>
    {
        const [ result, error ] = await dbhandleConnection.execute(str)
        return result
    },
    format: str =>
    {
        return dbhandleConnection.escape(str)
    }
}
const modeHandle = {
    query: async (serverID, str) =>
    {
        if(isNaN(serverID) || serverID === undefined || serverID < 0 || serverID >= modeHandleConnection.length)return undefined

        const [ result, error ] = await modeHandleConnection[serverID].execute(str)
        return result
    },
    format: str =>
    {
        return dbhandleConnection.escape(str)
    }
}

async function mysqlConnection()
{
    console.log('Start MySQL connection...')

    dbhandleConnection = await mysql2.createConnection(dbhandleConfig)

    modeHandleConnection[0] = await mysql2.createConnection({
        host: modeMysqlConfig[0].host,
        user: modeMysqlConfig[0].user,
        database: modeMysqlConfig[0].database,
        password: modeMysqlConfig[0].password
    })
    modeHandleConnection[1] = await mysql2.createConnection({
        host: modeMysqlConfig[1].host,
        user: modeMysqlConfig[1].user,
        database: modeMysqlConfig[1].database,
        password: modeMysqlConfig[1].password
    })

    await dbhandleConnection.execute('SET session wait_timeout=2000000;')

    await modeHandleConnection[0].execute('SET session wait_timeout=2000000;')
    await modeHandleConnection[1].execute('SET session wait_timeout=2000000;')

    var result = await modeHandle.query(0, 'select serverOtherNames from other')
    modeMysqlConfig[0].serverName = result[0]['serverOtherNames']

    result = await modeHandle.query(1, 'select serverOtherNames from other')
    modeMysqlConfig[1].serverName = result[0]['serverOtherNames']

    console.log('MySQL connection is SUCCESS')
}
async function mysqlClosed()
{
    await dbhandleConnection.close()

    await modeHandleConnection[0].close()
    // await modeHandleConnection[1].close()

    console.log('MySQL connection is CLOSED')
}

module.exports = { mysqlConnection, mysqlClosed, dbhandle, modeHandle }

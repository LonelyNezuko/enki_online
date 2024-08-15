const { modeHandle } = require('./mysqlConnection')

const messages = {
    addGroup: async (server, ownerID, title, accounts, settings = {}) =>
    {
        var result = await modeHandle.query(server, `insert into messages_group (title, ownerID, accounts, notanswered) values (${modeHandle.format(title)}, ${modeHandle.format(ownerID)}, ${modeHandle.format(JSON.stringify(accounts))}, ${settings.notanswered || 0})`)
        if(!result)return -1

        return result.insertId
    },
    addMessage: async (server, gid, uid, text, settings = {}) =>
    {
        var result = await modeHandle.query(server, `select accounts, notanswered from messages_group where id = ${modeHandle.format(gid)}`)
        if(!result || result.length)return false

        const
            accounts = JSON.parse(result[0]['accounts']),
            notanswered = result[0]['notanswered']

        if(notanswered)return false
        if(accounts.indexOf(uid) === -1)return false

        result = await modeHandle.query(server, `insert into messages (gid, uid, text, textAns) values (${modeHandle.format(gid)}, ${modeHandle.format(uid)}, ${modeHandle.format(text)}, ${settings.ans || 0})`)
        return result.insertId
    }
}

module.exports = messages

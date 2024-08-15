const { modeHandle } = require('./mysqlConnection')
const server = require('./server')

const user = {
    load: async (data, isOneError = false) =>
    {
        if(data === undefined
            || data.password === undefined
            || data.server === undefined)return isOneError ? 'no' : 'incorrect_data'

        if(data.uid === undefined
            && data.username === undefined)return isOneError ? 'no' : 'incorrect_data'

        let account = await modeHandle.query(data.server, `select * from players where ${data.username ? 'pName' : 'pID'} = ${modeHandle.format(data.username ? data.username : data.uid)}`)

        if(!account.length)return isOneError ? 'no' : 'account_not_found'
        account = account[0]

        if(account.pPassword.toLowerCase() !== data.password.toLowerCase())return isOneError ? 'no' : 'invalid_password'
        account.admin = await modeHandle.query(data.server, `select * from admins where aPlayerID = ${modeHandle.format(account.pID)}`)

        if(!account.admin.length) delete account.admin
        else account.admin = account.admin[0]

        account.ban = await modeHandle.query(data.server, `select * from playerbans where banPlayerID = ${modeHandle.format(account.pID)}`)

        if(!account.ban.length) delete account.ban
        else
        {
            account.ban = account.ban[0]

            if(parseInt(account.ban.banTime.toString() + '000') < new Date(account.ban.banDate).getTime())
            {
                delete account.ban
                await modeHandle.query(data.server, `delete from playerbans where banPlayerID = ${modeHandle.format(account.pID)}`)
            }
        }

        if(account.pFraction != -1)
        {
            account.fraction = await modeHandle.query(data.server, `select frID, frName, frLeader, frLeaderName, frType, frColor, frRanksName from fractions where frID = ${modeHandle.format(account.pFraction)}`)

            if(!account.fraction.length)
            {
                delete account.fraction
                account.pFraction = -1
            }
            else account.fraction = account.fraction[0]
        }

        try
        {
            account.siteSettings = JSON.parse(account.siteSettings)
        }
        catch(e)
        {
            account.siteSettings = user.config.defaultSiteSettings
            await modeHandle.query(data.server, `update players set siteSettings = ${modeHandle.format(JSON.stringify(account.siteSettings))} where pID = ${modeHandle.format(account.pID)}`)
        }

        return account
    },

    getCookiesAuth: (cookies) =>
    {
        let auth = cookies.auth
        if(auth)
        {
            try
            {
                auth = JSON.parse(auth)
            }
            catch(e)
            {
                auth = {}
            }
        }
        return auth
    },

    config: {
        defaultSiteSettings: {
            notf: {
                reportStatusMy: true,
                reportStatus: true
            }
        }
    },

    sendNotf: async (serverID, uid, subUID, title, text, url = '') =>
    {
        var result = await modeHandle.query(serverID, `insert into notf (notfAccount, notfSubAccount, notfTitle, notfText, notfURL) values (${modeHandle.format(uid)}, ${modeHandle.format(subUID)}, ${modeHandle.format(title)}, ${modeHandle.format(text)}, ${modeHandle.format(url)})`)
        if(!result)return false

        server.sendCMD(serverID, 'player.sendNotf', `${uid};${result.insertId};${title};${text}`)
    }
}

module.exports = user

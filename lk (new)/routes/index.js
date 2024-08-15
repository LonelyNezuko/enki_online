const express = require('express');
const router = express.Router();

const user = require('../modules/user')

const { modeHandle } = require('../modules/mysqlConnection')
const { modeMysqlConfig } = require('../bin/config_mysql')

router.get('/', (req, res, next) =>
{
    res.render('index', { pathname: "/", attrs: {} })
})

router.get('/login', (req, res, next) =>
{
    const servers = []
    modeMysqlConfig.forEach((item, i) =>
    {
        servers.push({
            name: `Enki Online | ${item.serverName}`,
            id: i
        })
    })

    res.render('login', { servers: JSON.stringify(servers) })
})


// post
router.post('/_default', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        load()
    })

    async function load()
    {
        let
            freeNotf = 0,
            freeMessages = 0

        const notf = await modeHandle.query(account.server, `select * from notf where notfAccount = ${modeHandle.format(account.uid)} and notfRead = 0`)
        if(notf.length) freeNotf = notf.length

        let notfall = await modeHandle.query(account.server, `select * from notf where notfAccount = ${modeHandle.format(account.uid)} order by notfID desc`)
        if(notfall.length)
        {
            let ids = "("
    		notfall.forEach((item, i) =>
    		{
                if(item.notfSubAccount !== undefined && !isNaN(item.notfSubAccount))
                {
        			ids += item.notfSubAccount

        			if(i === notfall.length - 1) ids += ")"
        			else ids += ","
                }
    		})

            let notfSubAccounts
            if(ids != "(") notfSubAccounts = await modeHandle.query(account.server, `select pID, pSkin from players where pID in ${ids}`)

            notfall.forEach((item, i) =>
            {
                if(item.notfSubAccount === -1) notfall[i].notfAvatar = '/images/skins/-1.png'
                else
                {
                    if(notfSubAccounts)
                    {
                        notfSubAccounts.forEach(pl =>
                        {
                            if(item.notfSubAccount === pl.pID) notfall[i].notfAvatar = `/images/skins/${pl.pSkin}.png`
                        })
                    }
                }
            })
        }

        const messagesGroup = await modeHandle.query(account.server, `select id from messages_group where json_contains(accounts, ${modeHandle.format(account.uid)})`)
        if(messagesGroup.length)
        {
            let ids = "("
    		messagesGroup.forEach((item, i) =>
    		{
                if(item.id && !isNaN(item.id))
                {
        			ids += item.id

        			if(i === messagesGroup.length - 1) ids += ")"
        			else ids += ","
                }
    		})

            if(ids != "(")
            {
                const messages = await modeHandle.query(account.server, `select * from messages where gid in ${ids} and not json_contains(accReads, ${modeHandle.format(account.uid)})`)
                if(messages.length) freeMessages = messages.length
            }
        }

        freeMessages = 0
        return res.send(JSON.stringify({
            freeNotf: freeNotf,
            freeMessages: freeMessages,
            notfAll: notfall,
            account: account.data
        }))
    }
})

router.post('/_search', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        search()
    })

    async function search()
    {
        const
            type = req.body.type,
            text = req.body.text

        if(type === undefined
            || text === undefined
            || text.length < 2)return res.send('notfound')
        if(type !== 'accounts' && type !== 'report' && type !== 'realty' && type !== 'promo')return  res.send('notfound')

        switch(type)
        {
            case 'accounts':
            {
                const accounts = await modeHandle.query(account.server, `select pID, pName, pSkin, pOnline, pLevel, pExp, pCash, pLastEnter, pFraction, pRank from players where pName like '${text}%' limit 8`)
                if(!accounts.length)return res.send('notfound')

                let ids = "("
        		accounts.forEach((item, i) =>
        		{
                    if(item.pID && !isNaN(item.pID))
                    {
            			ids += item.pID
                        ids += ","
                    }
        		})

                if(ids !== '(')
                {
                    ids = ids.substring(0, ids.length - 1) + ')'

                    const bans = await modeHandle.query(account.server, `select banPlayerID from playerbans where banPlayerID in ${ids}`)
                    if(bans.length)
                    {
                        accounts.forEach((item, i) =>
                        {
                            bans.forEach(ban =>
                            {
                                if(item.pID === ban.banPlayerID) accounts[i].ban = true
                            })
                        })
                    }

                    ids = "("
            		accounts.forEach((item, i) =>
            		{
                        accounts[i].fractionName = 'Неизвестно'
                        accounts[i].fractionRank = 'Неизвестно'

                        if(item.pFraction !== -1 && !isNaN(item.pFraction))
                        {
                			ids += item.pFraction
                            ids += ","
                        }
            		})

                    if(ids !== '(')
                    {
                        ids = ids.substring(0, ids.length - 1) + ')'

                        const fractions = await modeHandle.query(account.server, `select frID, frName, frRanksName from fractions where frID in ${ids}`)
                        if(fractions.length)
                        {
                            accounts.forEach((item, i) =>
                            {
                                fractions.forEach(fr =>
                                {
                                    if(item.pFraction === fr.frID)
                                    {
                                        accounts[i].fractionName = fr.frName
                                        accounts[i].fractionRank = fr.frRanksName.split(',')[item.pRank]
                                    }
                                })
                            })
                        }
                    }

                    return res.send(JSON.stringify(accounts))
                }
                return res.send('notfound')

                break
            }
        }
    }
})

module.exports = router;

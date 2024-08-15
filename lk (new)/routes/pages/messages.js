const express = require('express');
const router = express.Router();

const user = require('../../modules/user')
const messages = require('../../modules/messages')

const functions = require('../../modules/functions')

const { modeHandle } = require('../../modules/mysqlConnection')

router.get('/', (req, res, next) =>
{
    // res.render('index', { pathname: '/messages' })
    res.redirect('/account')
})


// post
// router.post('/_get', (req, res) =>
// {
//     if(!req.body)return res.sendStatus(400)
//
//     const account = user.getCookiesAuth(req.cookies)
//     user.load(account, true).then(result =>
//     {
//         if(result === 'no')return res.send('remove_cookies')
//
//         account.data = result
//         get()
//     })
//
//     async function get()
//     {
//         let messagesGroup = []
//         // let messagesGroup = await modeHandle.query(account.server, `select * from messages_group where json_contains(accounts, ${modeHandle.format(account.uid)})`)
//         // if(messagesGroup.length)
//         // {
//         //     let ids = functions.sqlInParser(messagesGroup, 'accounts').replace('[', '').replace(']', '')
//         //     messagesGroup.forEach((item, i) => messagesGroup[i].accounts = JSON.parse(messagesGroup[i].accounts))
//         //
//         //     const accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in ${ids}`)
//         //     if(accounts.length)
//         //     {
//         //
//         //     }
//         //
//         //
//         //     ids = functions.sqlInParser(messagesGroup, 'id')
//         //     if(ids.length)
//         //     {
//         //         const messages = await modeHandle.query(account.server, `select * from messages where gid in ${ids}`)
//         //         if(messages.length)
//         //         {
//         //             let ids = functions.sqlInParser(messages, 'uid')
//         //             if(ids.length)
//         //             {
//         //                 const accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in ${ids}`)
//         //                 if(accounts.length)
//         //                 {
//         //                     messages.forEach((item, i) =>
//         //                     {
//         //                         messages[i].account = {
//         //                             uid: -1,
//         //                             username: "Deleted",
//         //                             skin: -10
//         //                         }
//         //
//         //                         accounts.forEach(acc =>
//         //                         {
//         //                             if(item.uid === acc.pID) messages[i].account = {
//         //                                     uid: acc.pID,
//         //                                     username: acc.pName,
//         //                                     skin: acc.pSkin
//         //                                 }
//         //                         })
//         //                     })
//         //                 }
//         //
//         //                 messagesGroup.forEach((item, i) =>
//         //                 {
//         //                     messagesGroup[i].messages = []
//         //                     messages.forEach(mes =>
//         //                     {
//         //                         if(item.id === mes.gid) messagesGroup[i].messages.push(mes)
//         //                     })
//         //                 })
//         //             }
//         //             else messagesGroup = []
//         //         }
//         //         else messagesGroup = []
//         //     }
//         //     else messagesGroup = []
//         // }
//
//         return res.send(JSON.stringify({
//             account: account,
//             messagesGroup: messagesGroup
//         }))
//     }
// })
// router.post('/_read', (req, res) =>
// {
//     if(!req.body)return res.sendStatus(400)
//
//     const account = user.getCookiesAuth(req.cookies)
//     user.load(account, true).then(result =>
//     {
//         if(result === 'no')return res.send('remove_cookies')
//
//         account.data = result
//         read()
//
//         res.send('')
//     })
//
//     async function read()
//     {
//         if(req.body.groupID === undefined
//             || isNaN(req.body.groupID))return
//
//         const messageGroup = await modeHandle.query(account.server, `select accounts from messages_group where id = ${modeHandle.format(req.body.groupID)}`)
//         if(!messageGroup.length)return
//
//         if(messageGroup[0]['accounts'].split(',').indexOf(account.uid.toString()) === -1)return
//
//         const messages = await modeHandle.query(account.server, `select acc_reads from messages where group_id = ${modeHandle.format(req.body.groupID)}`)
//         if(!messages.length)return
//
//         let acc_reads = messages[0]['acc_reads']
//
//         if(acc_reads.length) acc_reads += `,${account.uid}`
//         else acc_reads += `${account.uid}`
//
//         await modeHandle.query(account.server, `update messages set acc_reads = ${modeHandle.format(acc_reads)} where group_id = ${modeHandle.format(req.body.groupID)}`)
//     }
// })
// router.post('/_send', (req, res) =>
// {
//     if(!req.body)return res.sendStatus(400)
//
//     const account = user.getCookiesAuth(req.cookies)
//     user.load(account, true).then(result =>
//     {
//         if(result === 'no')return res.send('remove_cookies')
//
//         account.data = result
//         send()
//     })
//
//     async function send()
//     {
//         if(req.body.groupID === undefined
//             || isNaN(req.body.groupID)
//             || req.body.text === undefined
//             || !req.body.text.length)return res.send('error')
//
//         if(!messages.addMessage(account.server, req.body.groupID, account.uid, req.body.text))return res.send('error')
//         res.send('')
//     }
// })

module.exports = router

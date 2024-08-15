const express = require('express');
const router = express.Router();

const sha256 = require('js-sha256')

const user = require('../../modules/user')
const server = require('../../modules/server')
const report = require('../../modules/report')

const functions = require('../../modules/functions')

const { modeHandle } = require('../../modules/mysqlConnection')

router.get('/', (req, res, next) =>
{
    // res.render('index', { pathname: '/report' })
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
//         let reports = await report.getReports(account.server, 'reportCreator', account.uid)
//         if(reports.length)
//         {
//             let ids = functions.sqlInParser(reports, 'reportCreator', false) + ',' + functions.sqlInParser(reports, 'reportPlayer', false)
//
//             let accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in (${ids})`)
//             if(accounts.length)
//             {
//                 reports = functions.arrayObjectCollecting(reports, accounts, 'reportCreatorData', 'reportCreator', 'pID', true)
//                 reports = functions.arrayObjectCollecting(reports, accounts, 'reportPlayerData', 'reportPlayer', 'pID', true)
//
//                 ids = functions.sqlInParser(reports, 'reportID')
//                 if(ids.length)
//                 {
//                     let reportMessages = await report.getReportMessages(account.server, ids)
//                     if(reportMessages.length)
//                     {
//                         ids = functions.sqlInParser(reportMessages, 'messageCreator')
//
//                         accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in ${ids}`)
//                         reportMessages = functions.arrayObjectCollecting(reportMessages, accounts, 'messageCreatorData', 'messageCreator', 'pID', true)
//
//                         reports = functions.arrayObjectCollecting(reports, reportMessages, 'messages', 'reportID', 'messageReport')
//                     }
//                     else reports = []
//                 }
//                 else reports = []
//             }
//             else reports = []
//         }
//
//         let reportsMe = await report.getReports(account.server, 'reportPlayer', account.uid)
//         if(reportsMe.length)
//         {
//             let ids = functions.sqlInParser(reportsMe, 'reportCreator', false) + ',' + functions.sqlInParser(reportsMe, 'reportPlayer', false)
//
//             let accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in (${ids})`)
//             if(accounts.length)
//             {
//                 reportsMe = functions.arrayObjectCollecting(reportsMe, accounts, 'reportCreatorData', 'reportCreator', 'pID', true)
//                 reportsMe = functions.arrayObjectCollecting(reportsMe, accounts, 'reportPlayerData', 'reportPlayer', 'pID', true)
//
//                 ids = functions.sqlInParser(reportsMe, 'reportID')
//                 if(ids.length)
//                 {
//                     let reportMessages = await report.getReportMessages(account.server, ids)
//                     if(reportMessages.length)
//                     {
//                         ids = functions.sqlInParser(reportMessages, 'messageCreator')
//
//                         accounts = await modeHandle.query(account.server, `select pID, pName, pSkin from players where pID in ${ids}`)
//                         reportMessages = functions.arrayObjectCollecting(reportMessages, accounts, 'messageCreatorData', 'messageCreator', 'pID', true)
//
//                         reportsMe = functions.arrayObjectCollecting(reportsMe, reportMessages, 'messages', 'reportID', 'messageReport')
//                     }
//                     else reportsMe = []
//                 }
//                 else reportsMe = []
//             }
//             else reportsMe = []
//         }
//
//         res.send(JSON.stringify({
//             account: account,
//             reports: reports,
//             reportsMe: reportsMe
//         }))
//     }
// })

module.exports = router

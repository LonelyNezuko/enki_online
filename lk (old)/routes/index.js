const host = require('../bin/host')

const router = require('express').Router();

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../bin/mysql.js')
const { sendServerCommand, sendServerLog, checkAccount, loadSettingsJSON } = require('./modules/funcs')

const nodemailer = require('nodemailer');
const sha256 = require('js-sha256')

// const speakeasy = require('speakeasy')
// const qrcode = require('qrcode')

// const authenticator = require('authenticator')

// get
router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/' })
});

router.get('/changemail', (req, res, next) =>
{
	res.render('index', { pageName: '/changemail' })
});
router.get('/login', (req, res, next) =>
{
	res.render('login')
});

router.get('/newdesing', (req, res, next) =>
{
	res.render('newdesing')
});
router.get('/login_new', (req, res, next) =>
{
	res.render('login_new')
});

// router.get('/roulette', (req, res, next) =>
// {
// 	res.render('index', { pageName: '/roulette' })
// });

// router.get('/test_email_send', (req, res, next) =>
// {
// 	async function send()
// 	{
// 		const mailtransport = await nodemailer.createTransport(host.connectMail)
// 		const mail = await mailtransport.sendMail({
// 			from: host.email,
// 			to: 'myangelnezuko@yandex.ru',
// 			subject: 'Проверка доставки письма',
// 			text: 'Проверка доставки письма',
// 			html: "<b>Работоспособность HTML</b>"
// 		})

// 		console.log('Message sent: ' + mail.messageID)
// 		console.log("Preview URL: " + nodemailer.getTestMessageUrl(mail));
// 	}

// 	console.log('start send mail')
// 	send().catch(console.error)
// });

// post
require('./pages/account')
require('./pages/admin')
require('./pages/find')
require('./pages/fraction')
require('./pages/messages')
require('./pages/notf')
require('./pages/recovery')
require('./pages/report')

router.post('/checklogin', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)
	if(!req.cookies.login)return res.send(false)

	const cookies = JSON.parse(req.cookies.login)
	if(!cookies.id || !cookies.pass || cookies.admin === undefined)return res.send('removecookies')

	const accData =
	{
		id: cookies.id,
		password: cookies.pass.toUpperCase(),
		admin: cookies.admin,
		server: cookies.server
	}
	checkAccount(accData).then(results =>
	{
		if(results.status === 'error')return res.send('removecookies')

		res.send(JSON.stringify({ id: results.account.pID, admin: results.account.pAdmin, name: results.account.pName, regContinue: results.account.pRegContinue, server: accData.server }))
	})
})

router.post('/login', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)

	async function get(data)
	{
		if(!data || !data.name || !data.pass || data.server === undefined || data.server < 0)return res.send('error')
		if(data.server >= modeMysqlConfig.length)return res.send('server not right')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[data.server])

		var [ results, err ] = await modeMysql.execute(`select pID, pPassword from players where pName = ${modeMysql.escape(data.name)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}
		const accData = results[0]

		if(accData.pPassword.toLowerCase() != sha256(data.pass).toLowerCase())
		{
			modeMysql.end()
			return res.send('password not right')
		}

		var [ results, err ] = await modeMysql.execute(`select aLevel from admins where aPlayerID = ${modeMysql.escape(parseInt(accData.pID))}`)

		if(!results.length) accData.pAdmin = 0
		else accData.pAdmin = results[0]['aLevel']

		modeMysql.end()
		res.send(JSON.stringify({ id: accData.pID, pass: accData.pPassword, admin: accData.pAdmin, server: data.server }))
	}
	get(req.body)
})

router.post('/cmd', (req, res, next) => // send server command
{
	if(!req.body)return res.sendStatus(400)
	if(!req.cookies.login)return res.send('exit')

	const cookies = JSON.parse(req.cookies.login)
	if(!cookies.id || !cookies.pass || cookies.admin === undefined)return res.send('exit')

	const accData =
	{
		id: cookies.id,
		password: cookies.pass.toUpperCase(),
		admin: cookies.admin,
		server: cookies.server
	}
	checkAccount(accData).then(results =>
	{
		if(results.status === 'error')return res.send('exit')

		accData.data = results.account
		func(req.body.cmd, !req.body.data ? {} : JSON.parse(req.body.data))
	})

	async function func(cmd, data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(!cmd || !data)return res.send('error')

		switch(cmd)
		{
			case 'player.kick':
			{
				const
					id = data[0],
					reason = data[1]

				if(id === undefined || reason === undefined)return res.send('error')
				if(id < 0)return res.send('errorID')
				if(reason.length < 1 || reason.length > 30)return res.send('errorReason')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, error ] = await modeMysql.execute(`select pOnline from players where pID = ${modeMysql.escape(id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('playerNotFound')
				}
				const account = results[0]

				if(account.pOnline == -1)
				{
					modeMysql.end()
					return res.send('playerNotOnline')
				}

				if(parseInt(accData.data.siteACPCommandKD) + 30000 > +new Date()
					&& accData.data.pName !== 'MyAngelNezuko')
				{
					modeMysql.end()
					return res.send('cooldown')
				}

				await modeMysql.execute(`update players set siteACPCommandKD = '${+new Date()}' where pID = ${modeMysql.escape(accData.data.pID)}`)
				modeMysql.end()

				await sendServerCommand(accData.server, 'player.kick', `${account.pOnline};${reason};${accData.data.pName}`)
				res.send()

				break
			}
			case 'player.mute':
			{
				const
					id = data[0],
					time = parseInt(data[1]),
					reason = data[2]

				if(id === undefined || reason === undefined || time === undefined)return res.send('error')
				if(id < 0)return res.send('errorID')
				if(reason.length < 1 || reason.length > 30)return res.send('errorReason')
				if(time < 1 || time > 600)return res.send('errorTime')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, error ] = await modeMysql.execute(`select pID, pName, pOnline, pMute from players where pID = ${modeMysql.escape(id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('playerNotFound')
				}
				const account = results[0]

				if(account.pMute > 0)
				{
					modeMysql.end()
					return res.send('playerIsMute')
				}

				if(parseInt(accData.data.siteACPCommandKD) + 30000 > +new Date()
					&& accData.data.pName !== 'MyAngelNezuko')
				{
					modeMysql.end()
					return res.send('cooldown')
				}

				await modeMysql.execute(`update players set siteACPCommandKD = '${+new Date()}' where pID = ${modeMysql.escape(accData.data.pID)}`)

				if(account.pOnline == -1) await modeMysql.execute(`update players set pMute = ${modeMysql.escape(time)} where pID = ${modeMysql.escape(account.pID)}`)
				else await sendServerCommand(accData.server, 'player.mute', `${account.pOnline};${time};${reason};${accData.data.pName}`)

				modeMysql.end()
				res.send()

				await sendServerLog(accData.server, [ account.pID, accData.data.pID, -1 ], `Администратор ${accData.data.pName} [${accData.data.pID}] выдал мут ${account.pName} [${account.pID}] на ${time} минут. Причина: ${reason}`)
				break
			}
			case 'player.warn':
			{
				if(accData.data.pAdmin < 2)return res.send('notadmin')

				const
					id = data[0],
					reason = data[1]

				if(id === undefined || reason === undefined)return res.send('error')
				if(id < 0)return res.send('errorID')
				if(reason.length < 1 || reason.length > 30)return res.send('errorReason')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, error ] = await modeMysql.execute(`select pID, pName, pOnline, pWarn, pWarnTime from players where pID = ${modeMysql.escape(id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('playerNotFound')
				}
				const account = results[0]

				if(parseInt(accData.data.siteACPCommandKD) + 30000 > +new Date()
					&& accData.data.pName !== 'MyAngelNezuko')
				{
					modeMysql.end()
					return res.send('cooldown')
				}
				await modeMysql.execute(`update players set siteACPCommandKD = '${+new Date()}' where pID = ${modeMysql.escape(accData.data.pID)}`)

				const gettime = require('../modules/gettime')
				if(account.pOnline == -1)
				{
					if(account.pWarn > 1 && account.pWarnTime + 950400 < gettime()) account.pWarn --

					account.pWarn ++
					account.pWarnTime = gettime() + (86400 * 11)

					await sendServerLog(accData.server, [ account.pID, accData.data.pID, -1 ], `${accData.data.pName} [${accData.data.pID}] выдал ${account.pWarn}/3 предупреждение ${account.pName} [${account.pID}]. Причина: ${reason}`)

					if(account.pWarn >= 3)
					{
						account.pWarn =
						account.pWarnTime = 0

						await modeMysql.execute(`insert into playerbans (banPlayerID, banPlayerName, banAdminName, banTime, banReason) values (${modeMysql.escape(account.pID)}, ${modeMysql.escape(account.pName)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(gettime() + (86400 * 7))}, '3/3 предупреждения (${reason})')`)
					}
					await modeMysql.execute(`update players set pWarn = ${modeMysql.escape(account.pWarn)}, pWarnTime = ${modeMysql.escape(account.pWarnTime)} where pID = ${modeMysql.escape(account.pID)}`)
				}
				else await sendServerCommand(accData.server, 'player.warn', `${account.pOnline};${reason};${accData.data.pName}`)

				modeMysql.end()
				res.send()

				break
			}
			case 'player.jail':
			{
				const
					id = data[0],
					time = parseInt(data[1]),
					reason = data[2]

				if(id === undefined || reason === undefined || time === undefined)return res.send('error')
				if(id < 0)return res.send('errorID')
				if(reason.length < 1 || reason.length > 30)return res.send('errorReason')
				if(time < 1 || time > 600)return res.send('errorTime')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, error ] = await modeMysql.execute(`select pID, pName, pOnline, pJail from players where pID = ${modeMysql.escape(id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('playerNotFound')
				}
				const account = results[0]

				if(account.pJail > 0)
				{
					modeMysql.end()
					return res.send('playerIsJail')
				}

				if(parseInt(accData.data.siteACPCommandKD) + 30000 > +new Date()
					&& accData.data.pName !== 'MyAngelNezuko')
				{
					modeMysql.end()
					return res.send('cooldown')
				}

				await modeMysql.execute(`update players set siteACPCommandKD = '${+new Date()}' where pID = ${modeMysql.escape(accData.data.pID)}`)

				if(account.pOnline == -1) await modeMysql.execute(`update players set pJail = ${modeMysql.escape(time)} where pID = ${modeMysql.escape(account.pID)}`)
				else await sendServerCommand(accData.server, 'player.mute', `${account.pOnline};${time};${reason};${accData.data.pName}`)

				modeMysql.end()
				res.send()

				await sendServerLog(accData.server, [ account.pID, accData.data.pID, -1 ], `Администратор ${accData.data.pName} [${accData.data.pID}] посадил в деморган ${account.pName} [${account.pID}] на ${time} минут. Причина: ${reason}`)
				break
			}
			case 'player.ban':
			{
				if(accData.data.pAdmin < 3)return res.send('notadmin')

				const
					id = data[0],
					time = parseInt(data[1]),
					reason = data[2]

				if(id === undefined || reason === undefined || time === undefined)return res.send('error')
				if(id < 0)return res.send('errorID')
				if(reason.length < 1 || reason.length > 30)return res.send('errorReason')
				if(time < 1 || time > 90)return res.send('errorTime')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, error ] = await modeMysql.execute(`select pID, pName, pOnline from players where pID = ${modeMysql.escape(id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('playerNotFound')
				}
				const account = results[0]

				var [ results, error ] = await modeMysql.execute(`select * from playerbans where banPlayerID = ${modeMysql.escape(id)}`)
				if(results.length)
				{
					modeMysql.end()
					return res.send('playerIsBan')
				}

				if(parseInt(accData.data.siteACPCommandKD) + 30000 > +new Date()
					&& accData.data.pName !== 'MyAngelNezuko')
				{
					modeMysql.end()
					return res.send('cooldown')
				}
				await modeMysql.execute(`update players set siteACPCommandKD = '${+new Date()}' where pID = ${modeMysql.escape(accData.data.pID)}`)

				const gettime = require('../modules/gettime')

				if(account.pOnline == -1) await modeMysql.execute(`insert into playerbans (banPlayerID, banPlayerName, banAdminName, banTime, banReason) values (${modeMysql.escape(account.pID)}, ${modeMysql.escape(account.pName)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(gettime() + (86400 * time))}, ${modeMysql.escape(reason)})`)
				else await sendServerCommand(accData.server, 'player.bam', `${account.pOnline};${time};${reason};${accData.data.pName}`)

				modeMysql.end()
				res.send()

				await sendServerLog(accData.server, [ account.pID, accData.data.pID, -1 ], `${accData.data.pName} [${accData.data.pID}] заблокировал ${account.pName} [${account.pID}] до ${new Date(+new Date() + ((86400 * time) * 1000)).toLocaleString()}. Причина: ${reason}`)
				break
			}
			default: res.send('cmdNotFound')
		}
	}
});

router.post('/loadpage', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)
	if(!req.cookies.login)return res.send('exit')

	const cookies = JSON.parse(req.cookies.login)
	if(!cookies.id || !cookies.pass || cookies.admin === undefined)return res.send('exit')

	const accData =
	{
		id: cookies.id,
		password: cookies.pass.toUpperCase(),
		admin: cookies.admin,
		server: cookies.server
	}
	checkAccount(accData).then(results =>
	{
		if(results.status === 'error')return res.send('exit')

		accData.data = results.account
		get(req.body.page, !req.body.data ? {} : JSON.parse(req.body.data))
	})

	async function get(pageName, data = {})
	{
		if(accData.data.pRegContinue)return res.send('regContinue')

		if(pageName === '/account')
		{
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var
				greetingsStr = "",
				count = 0

			if(accData.data.pGreetings !== null)
			{
				accData.data.pGreetings.split(",").forEach((item, i) =>
				{
					if(item != -1)
					{
						if(count == 0) greetingsStr += item
						else greetingsStr += "," + item

						count ++
					}
				})

				if(count)
				{
					var [ results, err ] = await modeMysql.execute(`select pID, pName, pSkin, pOnline from players where pID in (${greetingsStr})`)
					accData.data.pGreetings = results
				}
				else accData.data.pGreetings = []
			}
			else accData.data.pGreetings = []

			accData.data.fractionName = "Неимеется"
			accData.data.fractionRank = "Неимеется"

			if(accData.data.pFraction != -1)
			{
				var [ results, err ] = await modeMysql.execute(`select frName, frRanksName from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
				if(results.length)
				{
					accData.data.fractionName = results[0]['frName']

					var ranks = results[0]['frRanksName'].split(",")
					ranks.forEach((item, id) =>
					{
						if(id == accData.data.pRank) accData.data.fractionRank = item
					})
				}
			}

			if(accData.data.pPromoName != '-')
			{
				var [ results, err ] = await modeMysql.execute(`select promoName, promoID from promocodes where promoName = ${modeMysql.escape(accData.data.pPromoName)}`)

				if(results.length) accData.data.pPromoName = { name: results[0]['promoName'], id: results[0]['promoID'] }
				else accData.data.pPromoName = '-'
			}

			if(accData.data.pAdmin > 0)
			{
				var [ results, err ] = await modeMysql.execute(`select * from admins where aPlayerID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
				accData.data.adminData = results[0]
			}

			var [ results, err ] = await modeMysql.execute(`select * from playerbans where banPlayerID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
			if(results.length)
			{
				accData.data.banData = results[0]

				const gettime = require('../modules/gettime')
				if(accData.data.banData.banTime < gettime())
				{
					await modeMysql.execute(`delete from playerbans where banPlayerID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
					accData.data.banData = 'unban'
				}
			}

			var [ results, err ] = await modeMysql.execute(`select donSum from donates where donPlayerID = ${modeMysql.escape(parseInt(accData.data.pID))} and donSuccess = 1`)
			if(results.length)
			{
				accData.data.newDonate = 0
				results.forEach(item => accData.data.newDonate += item.donSum)

				if(accData.data.pOnline != -1) await sendServerCommand(accData.server, 'player.donate.give', `${accData.data.pOnline};${accData.data.newDonate}`)
				else await modeMysql.execute(`update players set pDonate = pDonate + ${accData.data.newDonate} where pID = ${modeMysql.escape(parseInt(accData.data.pID))}`)

				accData.data.pDonate += accData.data.newDonate
				await modeMysql.execute(`update donates set donSuccess = 2 where donPlayerID = ${modeMysql.escape(parseInt(accData.data.pID))} and donSuccess = 1`)
			}

			var [ results, err ] = await modeMysql.execute(`select houseID, houseType, houseNalog from houses where houseOwner = ${modeMysql.escape(parseInt(accData.data.pID))}`)
			accData.data.realty = []

			if(results.length)
			{
				results.forEach(item =>
				{
					accData.data.realty.push({
						type: 'house',
						id: item.houseID,
						types: item.houseType,
						nalog: item.houseNalog
					})
				})
			}

			var [ results, err ] = await modeMysql.execute(`select bID, bType, bNalog from biz where bOwner = ${modeMysql.escape(parseInt(accData.data.pID))}`)
			if(results.length)
			{
				results.forEach(item =>
				{
					accData.data.realty.push({
						type: 'biz',
						id: item.bID,
						types: item.bType,
						nalog: item.bNalog
					})
				})
			}

			var [ results, err ] = await modeMysql.execute(`select vehID, vehNalog from vehicles where vehTypeID = ${modeMysql.escape(parseInt(accData.data.pID))} and vehType = 1`)
			if(results.length)
			{
				results.forEach(item =>
				{
					accData.data.realty.push({
						type: 'vehicle',
						id: item.vehID,
						nalog: item.vehNalog
					})
				})
			}

			modeMysql.end()
			res.send(accData.data)
		}
		else if(pageName === '/account/settings')
		{
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select pGoogleAuth, pGoogleAuthCode, siteSettings from players where pID = ${modeMysql.escape(parseInt(accData.data.pID))}`)

			const acc = results[0]
			if(acc.pGoogleAuth === 1)
			{
				// const token = speakeasy.generateSecret()
				//
				// results[0]['pGoogleAuth'] = token.base32
				// results[0]['pGoogleAuthOff'] = true
				//
				// await modeMysql.execute(`update players set pGoogleAuthAccept = ${modeMysql.escape(results[0]['pGoogleAuth'])} where pID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
				// qrcode.toDataURL(token.otpauth_url, (err, data_url) =>
				// {
				// 	results[0]['pGoogleAuthQR'] = data_url
				// 	res.send({ auth: results[0] })
				// })
				//
				// results[0]['pGoogleAuth'] = authenticator.generateKey()
				// results[0]['pGoogleAuthOff'] = true
				//
				// await modeMysql.execute(`update players set pGoogleAuthAccept = ${modeMysql.escape(results[0]['pGoogleAuth'])} where pID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
				// res.send({ auth: results[0] })
			}

			try
			{
				acc.siteSettings = JSON.parse(acc.siteSettings)
			}
			catch(e)
			{
				const { accountDefaultSiteSettings } = require('../bin/config')

				await modeMysql.execute(`update players set siteSettings = ${modeMysql.escape(JSON.stringify(accountDefaultSiteSettings))} where pID = ${modeMysql.escape(parseInt(accData.data.pID))}`)
				acc.siteSettings = accountDefaultSiteSettings
			}

			modeMysql.end()
			res.send({ settings: acc.siteSettings })
		}
		else if(pageName === '/report')
		{
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
			if(!data.searchID)
			{
				const reports = {}

				var [ results, err ] = await modeMysql.execute(`select * from report where reportCreator = ${modeMysql.escape(accData.id)} order by reportID desc`)
				reports.myReports = results

				let tagIds = ""
				reports.myReports.forEach((item, i) =>
				{
					if(i == 0) tagIds += item.reportTag
					else tagIds += "," + item.reportTag

					item.reportTagName = "Неизвестно"
					item.reportTagColor = "#000000"
				})

				if(tagIds != "")
				{
					var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID in (${tagIds})`)
					reports.myReports.forEach(item =>
					{
						results.forEach(tagItem =>
						{
							if(item.reportTag == tagItem.tagID)
							{
								item.reportTagName = tagItem.tagName
								item.reportTagColor = tagItem.tagColor
							}
						})
					})
				}

				reports.myReports.forEach((item, i) =>
				{
					if(item.reportTagName === "Неизвестно"
						&& item.reportTag === 0) item.reportTagName = "Без тега"
				})

				let ids = "("
				reports.myReports.forEach((item, i) =>
				{
					ids += item.reportID

					if(i === reports.myReports.length - 1) ids += ")"
					else ids += ","

					item.reads = 0
				})
				if(ids != "(")
				{
					var [ results, err ] = await modeMysql.execute(`select messageReport from report_messages where messageReport in ${ids} and messageReads not like '%${accData.data.pID}%'`)

					reports.myReports.forEach(item =>
					{
						results.forEach(mes =>
						{
							if(mes.messageReport === item.reportID) item.reads ++
						})
					})
				}

				var [ results, err ] = await modeMysql.execute(`select * from report where reportPlayer = ${modeMysql.escape(accData.id)} order by reportID desc`)
				reports.reports = results

				tagIds = ""
				reports.reports.forEach((item, i) =>
				{
					if(i == 0) tagIds += item.reportTag
					else tagIds += "," + item.reportTag

					item.reportTagName = "Неизвестно"
					item.reportTagColor = "#000000"
				})

				if(tagIds != "")
				{
					var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID in (${tagIds})`)
					reports.reports.forEach(item =>
					{
						results.forEach(tagItem =>
						{
							if(item.reportTag == tagItem.tagID)
							{
								item.reportTagName = tagItem.tagName
								item.reportTagColor = tagItem.tagColor
							}
						})
					})
				}

				reports.reports.forEach((item, i) =>
				{
					if(item.reportTagName === "Неизвестно"
						&& item.reportTag === 0) item.reportTagName = "Без тега"
				})

				ids = "("
				reports.reports.forEach((item, i) =>
				{
					ids += item.reportID

					if(i === reports.reports.length - 1) ids += ")"
					else ids += ","

					item.reads = 0
				})
				if(ids != '(')
				{
					var [ results, err ] = await modeMysql.execute(`select messageReport from report_messages where messageReport in ${ids} and messageReads not like '%${accData.data.pID}%'`)

					reports.reports.forEach(item =>
					{
						results.forEach(mes =>
						{
							if(mes.messageReport === item.reportID) item.reads ++
						})
					})
				}

				res.send(reports)
			}
			else
			{
				if(isNaN(data.searchID))
				{
					modeMysql.end()
					return res.send('searchNone')
				}

				var [ results, err ] = await modeMysql.execute(`select * from report where reportID = ${modeMysql.escape(data.searchID)}`)
				if(!results.length)
				{
					modeMysql.end()

					return res.send('searchNone')
				}

				const report = results[0]

				if(report.reportCreator != accData.id
					&& report.reportPlayer != accData.id)
				{
					modeMysql.end()

					return res.send('searchNone')
				}

				var [ results, err ] = await modeMysql.execute(`select * from report_messages where messageReport = ${modeMysql.escape(report.reportID)}`)
				if(!results.length)
				{
					await modeMysql.execute(`delete from report where reportID = ${modeMysql.escape(report.reportID)}`)
					modeMysql.end()

					return res.send('searchNone')
				}
				report.messages = results
				report.messages.forEach((item, i) =>
				{
					if(item.messageCreator === accData.id) report.messages[i].messageMe = true
				})

				report.reportTagName = "Без тега"
				report.reportTagColor = "#000000"

				if(report.reportTag != 0)
				{
					var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID = ${modeMysql.escape(report.reportTag)}`)
					if(!results.length) await modeMysql.execute(`update report set reportTag = 0 where reportID = ${modeMysql.escape(report.reportID)}`)
					else
					{
						report.reportTagName = results[0]['tagName']
						report.reportTagColor = results[0]['tagColor']
					}
				}

				await modeMysql.execute(`update report_messages set messageReads = concat(messageReads, '${accData.data.pID},') where messageReport = ${modeMysql.escape(report.reportID)} and messageReads not like '%${accData.data.pID}%'`)
				res.send(report)
			}
			modeMysql.end()
		}
		else if(pageName === '/fraction')
		{
			if(accData.data.pFraction == -1)
			{
				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

				var [ results, err ] = await modeMysql.execute(`select appForms, appStatus, appFrac from fraction_apps where appCreator = ${modeMysql.escape(accData.data.pID)} and appStatus = 0`)
				if(!results.length)
				{
					var [ results, err ] = await modeMysql.execute(`select siteFracAppTiming from players where pID = ${modeMysql.escape(accData.data.pID)}`)

					modeMysql.end()
					return res.send({ status: 'notFraction', errTiming: parseInt(results[0]['siteFracAppTiming']) })
				}
				const app = results[0]

				var [ results, err ] = await modeMysql.execute(`select frName from fractions where frID = ${modeMysql.escape(app.appFrac)}`)
				if(!results.length)
				{
					await modeMysql.execute(`delete from fraction_apps where appCreator = ${modeMysql.escape(accData.data.pID)}`)

					modeMysql.end()
					return res.send({ status: 'notFraction' })
				}

				app.appForms = JSON.parse(app.appForms)
				app.appFracName = results[0]['frName']

				modeMysql.end()
				return res.send({ status: 'notFraction', data: app })
			}
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select frType, frName, frID, frLeader, frLeaderName, frBank, siteSettings from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
			if(!results.length)return res.send('error'), modeMysql.end()

			const frac = results[0]

			var [ results, err ] = await modeMysql.execute(`select count(pID) from players where pFraction = ${modeMysql.escape(frac.frID)}`)
			frac.allPlayers = results[0]['count(pID)']

			var [ results, err ] = await modeMysql.execute(`select pID, pName, pOnline from players where pFraction = ${modeMysql.escape(frac.frID)} and pOnline != -1 limit 10`)
			frac.onlinePlayers = results

			var [ results, err ] = await modeMysql.execute(`select pID, pName, pLastEnter from players where pFraction = ${modeMysql.escape(frac.frID)} and pOnline = -1 order by pLastEnter desc limit 10`)
			frac.lastOnlinePlayers = results

			var [ results, err ] = await modeMysql.execute(`select appCreatorName, appID, appCreateDate from fraction_apps where appFrac = ${modeMysql.escape(frac.frID)} and appStatus = 0 order by appCreateDate desc limit 10`)
			frac.lastApps = results

			var [ results, err ] = await modeMysql.execute(`select count('count') from fraction_apps where appFrac = ${modeMysql.escape(frac.frID)} and appStatus = 0`)
			frac.allApps = results[0]["count('count')"]

			var [ results, err ] = await modeMysql.execute(`select pID, pName from players where pFraction = ${modeMysql.escape(frac.frID)} and pID != ${modeMysql.escape(accData.data.pID)}`)
			frac.allPlayersList = results

			if(accData.data.pID === frac.frLeader)
			{
				try
				{
					frac.siteSettings = JSON.parse(frac.siteSettings)
				}
				catch(e)
				{
					const { fractionDefaultSettings } = require('../bin/config')

					await modeMysql.execute(`update fractions set siteSettings = ${modeMysql.escape(JSON.stringify(fractionDefaultSettings))} where frID = ${modeMysql.escape(frac.frID)}`)
					frac.siteSettings = fractionDefaultSettings
				}
			}
			else delete frac.siteSettings

			modeMysql.end()
			res.send({ status: "success", data: frac })
		}
		else if(pageName === '/fraction/application')
		{
			if(accData.data.pFraction != -1)return res.send('notright')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
			if(!data.frac)
			{
				var [ results, err ] = await modeMysql.execute(`select frName, frSiteApp from fractions where frType != 5 and frType != 6 and JSON_VALUE(frSiteApp, '$.status') = 1`)
				if(!results.length)return res.send('notFractions'), modeMysql.end()

				const fractions = []
				results.forEach(item => fractions.push({ name: item.frName, level: JSON.parse(item.frSiteApp).level }))

				modeMysql.end()
				res.send({ type: 'list', data: fractions })
			}
			else
			{
				var [ results, err ] = await modeMysql.execute(`select frID, frType, frSiteApp from fractions where frName = ${modeMysql.escape(data.frac)}`)
				if(!results.length)return res.send('notFraction'), modeMysql.end()

				const fraction = results[0]
				if(fraction.frType == 5 || fraction.frType == 6)return res.send('fracGang'), modeMysql.end()

				try
				{
					fraction.frSiteApp = JSON.parse(fraction.frSiteApp)
				}
				catch(e)
				{
					const { fractionDefaultSiteApp } = require('../bin/config')

					await modeMysql.execute(`update fractions set frSiteApp = ${modeMysql.escape(JSON.stringify(fractionDefaultSiteApp))} where frID = ${modeMysql.escape(fraction.frID)}`)
					fraction.frSiteApp = fractionDefaultSiteApp
				}

				if(fraction.frSiteApp.status == 0)return res.send('fractionNotStatus'), modeMysql.end()
				if(fraction.frSiteApp.level > accData.data.pLevel)return res.send('notLevel'), modeMysql.end()

				var [ results, err ] = await modeMysql.execute(`select frForms from fraction_forms where frID = ${modeMysql.escape(fraction.frID)}`)
				if(!results.length)return res.send('fractionNotForms'), modeMysql.end()

				const forms = JSON.parse(results[0]['frForms'])
				if(!forms || !forms.length)return res.send('fractionNotForms'), modeMysql.end()

				modeMysql.end()
				res.send({ type: 'forms', data: forms })
			}
		}
		else if(pageName === '/fraction/applications')
		{
			if(accData.data.pFraction == -1)return res.send('notrights')
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select frID, frType, frLeader, frSiteApp from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
			if(!results.length)return res.send('notFractions'), modeMysql.end()

			const fraction = results[0]
			if(fraction.frLeader != accData.data.pID)return res.send('notrights'), modeMysql.end()

			if(fraction.frType == 5
				|| fraction.frType == 6)return res.send('gang'), modeMysql.end()

			if(data.id && !isNaN(data.id))
			{
				var [ results, err ] = await modeMysql.execute(`select * from fraction_apps where appFrac = ${modeMysql.escape(accData.data.pFraction)} and appID = ${modeMysql.escape(data.id)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send('notfound')
				}
				const app = results[0]
				var [ results, err ] = await modeMysql.execute(`select * from players where pID = ${modeMysql.escape(app.appCreator)}`)

				const account = results[0]
				if(!results.length
					|| account.pFraction != -1)
				{
					await modeMysql.execute(`delete from fraction_apps where appID = ${modeMysql.escape(app.appID)}`)

					modeMysql.end()
					return res.send('notfound')
				}

				res.send({ app: app, account: account })
			}
			else
			{
				try
				{
					fraction.frSiteApp = JSON.parse(fraction.frSiteApp)
				}
				catch(e)
				{
					const { fractionDefaultSiteApp } = require('../bin/config')

					await modeMysql.execute(`update fractions set frSiteApp = ${modeMysql.escape(JSON.stringify(fractionDefaultSiteApp))} where frID = ${modeMysql.escape(fraction.frID)}`)
					fraction.frSiteApp = fractionDefaultSiteApp
				}

				var [ results, err ] = await modeMysql.execute(`select appCreatorName, appID, appCreateDate from fraction_apps where appFrac = ${modeMysql.escape(accData.data.pFraction)} and appStatus = 0 order by appCreateDate desc`)
				fraction.apps = results

				var [ results, err ] = await modeMysql.execute(`select appCreatorName, appCreator, appEditor, appEditorName, appEditDate, appStatus, appEditReason from fraction_apps where appFrac = ${modeMysql.escape(accData.data.pFraction)} and appStatus != 0 order by appEditDate desc limit 10`)
				fraction.lastAppsEdit = results

				res.send({ fraction: fraction })
			}

			modeMysql.end()
		}
		else if(pageName === '/fraction/applications/edit')
		{
			if(accData.data.pFraction == -1)return res.send('notrights')
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select frLeader from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send('error')
			}

			if(accData.id != results[0]['frLeader'])return res.send('notrights'), modeMysql.end()
			if(results[0]['frType'] == 5
				|| results[0]['frType'] == 6)return res.send('gang'), modeMysql.end()

			var [ results, err ] = await modeMysql.execute(`select frForms from fraction_forms where frID = ${modeMysql.escape(accData.data.pFraction)}`)

			let forms = []
			if(results.length) forms = JSON.parse(results[0]['frForms'])

			modeMysql.end()
			res.send(forms)
		}
		else if(pageName === '/admin')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')

			const settings = loadSettingsJSON()
			if(settings.admin.view.main > accData.data.pAdmin)return res.send('notadmin')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var
				lastLogs = [],
				popularPromo = [],
				lastRegAcc = [],

				onlinesDay = [],
				onlines =
				{
					max: 0,
					min: 0,
					total: 0
				}

			var [ results, err ] = await modeMysql.execute(`select * from logs order by time desc limit 10`)
			if(results.length) results.forEach(item => lastLogs.push({ userid: item.userid, text: item.text, time: item.time }))

			var [ results, err ] = await modeMysql.execute(`select * from promocodes order by promoActives desc limit 10`)
			if(results.length) results.forEach(item => popularPromo.push({ id: item.promoID, name: item.promoName, creator: item.promoCreator, actives: item.promoActives }))

			var [ results, err ] = await modeMysql.execute(`select * from players order by pRegDate desc limit 5`)
			if(results.length) results.forEach(item => lastRegAcc.push({ userid: item.pID, name: item.pName, regDate: item.pRegDate }))

			var [ results, err ] = await modeMysql.execute(`select * from serveronline where date = convert('${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}', date)`)

			if(!results.length) onlines = null
			else
			{
				onlinesDay = results[0]['online'].split(',')
				onlinesDay.forEach((item, i) =>
				{
					if(item > 0) onlines.total += parseInt(item)
				})

				onlines.max = Math.max.apply(null, onlinesDay)
				onlines.min = Math.min.apply(0, onlinesDay)
			}

			modeMysql.end()
			res.send({ lastLogs: lastLogs, popularPromo: popularPromo, lastRegAcc: lastRegAcc, onlines: onlines, onlinesDay: onlinesDay })
		}
		else if(pageName === '/admin/promo')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')

			const settings = loadSettingsJSON()
			if(settings.admin.view.promo > accData.data.pAdmin)return res.send('notadmin')

			if(data.create !== undefined)return res.send({ create: true })

			if(!data.id || isNaN(data.id))return res.send('noid')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select * from promocodes where promoID = ${modeMysql.escape(data.id)}`)
			if(!results.length)return res.send('notfound'), modeMysql.end()

			modeMysql.end()
			res.send(results[0])
		}
		else if(pageName === '/admin/realty')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')

			const settings = loadSettingsJSON()
			if(settings.admin.view.realty > accData.data.pAdmin)return res.send('notadmin')

			if(data.type === undefined
				|| (data.type != 'house'
					&& data.type != 'veh'
					&& data.type != 'biz'))return res.send('notype')
			if(data.id === undefined || isNaN(data.id))return res.send('noid')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select * from ${data.type == 'house' ? "houses" : data.type == 'veh' ? "vehicles" : "biz"} where ${data.type == 'house' ? "houseID" : data.type == 'veh' ? "vehID" : "bID"} = ${modeMysql.escape(data.id)}`)
			if(!results.length)return res.send('notfound'), modeMysql.end()

			if(data.type === 'house')
			{
				const houseData = results[0]
				var [ results, err ] = await modeMysql.execute(`select * from players where pRentHouse = ${modeMysql.escape(data.id)}`)

				res.send({ house: houseData, rents: results })
			}
			if(data.type === 'biz')
			{
				const bizData = results[0]
				bizData.bMafiaName = "Неимеется"

				if(bizData.bMafia != -1)
				{
					var [ results, err ] = await modeMysql.execute(`select frName from fractions where frID = ${modeMysql.escape(bizData.bMafia)}`)

					if(results.length) bizData.bMafiaName = results[0]['frName']
					else bizData.bMafia = -1

					res.send(bizData)
				}
				else res.send(bizData)
			}
			else res.send(results[0])

			modeMysql.end()
		}
		else if(pageName === '/admin/account')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')
			if(data.id === undefined || isNaN(data.id))return res.send('noid')

			const settings = loadSettingsJSON()
			if(settings.admin.view.account > accData.data.pAdmin)return res.send('notadmin')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
			var [ results, err ] = await modeMysql.execute(`select * from players where pID = ${modeMysql.escape(data.id)}`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send('notfound')
			}
			const account = results[0]

			account.settings = {
				admStats: settings.admin.view.admStats
			}

			var [ results, err ] = await modeMysql.execute(`select * from admins where aPlayerID = ${modeMysql.escape(data.id)}`)
			if(results.length)
			{
				account.pAdmin = results[0]['aLevel']
				if(account.pAdmin > 0) account.adminData = results[0]
			}

			var [ results, err ] = await modeMysql.execute(`select * from playerbans where banPlayerID = ${modeMysql.escape(parseInt(account.pID))}`)
			if(results.length)
			{
				account.banData = results[0]

				const gettime = require('../modules/gettime')
				if(account.banData.banTime < gettime())
				{
					await modeMysql.execute(`delete from playerbans where banPlayerID = ${modeMysql.escape(parseInt(account.pID))}`)
					account.banData = undefined
				}
			}

			var
				greetingsStr = "",
				count = 0

			account.pGreetings.split(",").forEach((item, i) =>
			{
				if(item != -1)
				{
					if(count == 0) greetingsStr += item
					else greetingsStr += "," + item

					count ++
				}
			})

			account.pGreetings = []
			if(count)
			{
				var [ results, err ] = await modeMysql.execute(`select pID, pName, pSkin, pOnline from players where pID in (${greetingsStr})`)
				account.pGreetings = results
			}

			account.fractionName = "Неимеется"
			account.fractionRank = "Неимеется"

			if(account.pFraction != -1)
			{
				var [ results, err ] = await modeMysql.execute(`select frName, frRanksName from fractions where frID = ${modeMysql.escape(account.pFraction)}`)
				if(results.length)
				{
					account.fractionName = results[0]['frName']

					var ranks = results[0]['frRanksName'].split(",")
					ranks.forEach((item, id) =>
					{
						if(id == account.pRank) account.fractionRank = item
					})
				}
			}

			if(account.pPromoName != '-')
			{
				var [ results, err ] = await modeMysql.execute(`select promoName, promoID from promocodes where promoName = ${modeMysql.escape(account.pPromoName)}`)

				if(results.length) account.pPromoName = { name: results[0]['promoName'], id: results[0]['promoID'] }
				else account.pPromoName = '-'
			}

			var [ results, err ] = await modeMysql.execute(`select time, convert(time, char) from logs where userid = ${modeMysql.escape(data.id)} order by time desc limit 1`)
			account.lastLog = results[0]['convert(time, char)'].replace(' ', 'T')

			var newDate = new Date(results[0].time)

			newDate = new Date(newDate.setDate(newDate.getDate() - 3))
			newDate = new Date(newDate.setHours(newDate.getHours() + 3))

			var [ results, err ] = await modeMysql.execute(`select *,convert(time, char) from logs where userid = ${modeMysql.escape(data.id)} and time > convert(${modeMysql.escape(newDate)}, datetime) and time < convert(${modeMysql.escape(account.lastLog)}, datetime) order by time desc`)

			account.logs = results
			account.logs.forEach((item, i) =>
			{
				account.logs[i].time = results[i]['convert(time, char)'].replace(' ', 'T')
			})

			var [ results, err ] = await modeMysql.execute(`select convert(time, char) from logs where userid = ${modeMysql.escape(data.id)} order by time asc limit 1`)
			account.firstLog = results[0]['convert(time, char)'].replace(' ', 'T')

			var [ results, err ] = await modeMysql.execute(`select houseID, houseType from houses where houseOwner = ${modeMysql.escape(parseInt(data.id))}`)
			account.realty = []

			if(results.length)
			{
				results.forEach(item =>
				{
					account.realty.push({
						type: 'house',
						id: item.houseID,
						types: item.houseType
					})
				})
			}

			var [ results, err ] = await modeMysql.execute(`select bID, bType from biz where bOwner = ${modeMysql.escape(parseInt(data.id))}`)
			if(results.length)
			{
				results.forEach(item =>
				{
					account.realty.push({
						type: 'biz',
						id: item.bID,
						types: item.bType
					})
				})
			}

			var [ results, err ] = await modeMysql.execute(`select vehID from vehicles where vehTypeID = ${modeMysql.escape(parseInt(data.id))} and vehType = 1`)
			if(results.length)
			{
				results.forEach(item =>
				{
					account.realty.push({
						type: 'veh',
						id: item.vehID
					})
				})
			}

			modeMysql.end()
			res.send(account)
		}
		else if(pageName === '/admin/report')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')

			const settings = loadSettingsJSON()
			if(data.tags !== undefined)
			{
				if(settings.admin.report.tag.create > accData.data.pAdmin)return res.send('notadmin')

				const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
				var [ results, err ] = await modeMysql.execute(`select * from report_tags`)

				modeMysql.end()
				res.send(results)

				return false
			}
			if(settings.admin.view.report > accData.data.pAdmin)return res.send('notadmin')

			if(data.id === undefined || isNaN(data.id))return res.send('noid')

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select * from report where reportID = ${modeMysql.escape(data.id)}`)
			if(!results.length)return res.send('notfound'), modeMysql.end()

			const report = results[0]

			var [ results, err ] = await modeMysql.execute(`select * from report_messages where messageReport = ${modeMysql.escape(report.reportID)}`)
			if(!results.length)
			{
				await modeMysql.execute(`delete from report where reportID = ${modeMysql.escape(report.reportID)}`)
				modeMysql.end()

				return res.send('notfound')
			}

			report.messages = results
			if(!report.messageAns)
			{
				report.messages.forEach((item, i) =>
				{
					if(item.messageCreator === accData.data.pID) report.messages[i].messageMe = true
				})
			}

			report.reportTagName = "Бег тега"
			report.reportTagColor = "#000000"

			if(report.reportTag != 0)
			{
				var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID = ${modeMysql.escape(report.reportTag)}`)
				if(!results.length) await modeMysql.execute(`update report set reportTag = 0 where reportID = ${modeMysql.escape(report.reportID)}`)
				else
				{
					report.reportTagName = results[0]['tagName']
					report.reportTagColor = results[0]['tagColor']
				}
			}

			report.ansStatus = true
			// if(!report.reportStatus
			// 	&& adminLvl < settings.access.report.ans.open) report.ansStatus = false
			// if((report.reportStatus == 1
			// 	|| report.reportStatus == 2)
			// 	&& adminLvl < settings.access.report.ans.other) report.ansStatus = false
			// if(report.reportStatus == 3
			// 	&& adminLvl < settings.access.report.ans.close) report.ansStatus = false
			// if(!report.reportStatus == 4
			// 	&& adminLvl < settings.access.report.ans.pending) report.ansStatus = false

			// report.changeStatus = adminLvl >= settings.access.report.changestatus

			modeMysql.end()
			res.send(report)
		}
		else if(pageName === '/admin/settings')
		{
			if(accData.data.pAdmin <= 0)return res.send('notrights')
			if(accData.data.pAdmin < 6)return res.send('notadmin')

			const settings = loadSettingsJSON()
			return res.send(settings)
		}
		else if(pageName === '/find')
		{
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
			var [ results, err ] = await modeMysql.execute(`select tagName from report_tags`)

			const sortTags = [ 'Все', 'Архив', 'Избранное', 'Без тега' ]
			if(results.length) results.forEach(item => sortTags.push(item.tagName))

			const settings = loadSettingsJSON()

			modeMysql.end()
			res.send({ sortTags: sortTags, settings: settings })
		}
		else if(pageName === '/messages')
		{
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
			if(!data.id)
			{
				var [ results, err ] = await modeMysql.execute(`select * from messages_group where accounts like '%${accData.data.pID}%' group by id desc`)
				let group = results

				if(group.length)
				{
					let ids = "("
					group.forEach((item, i) =>
					{
						ids += item.id

						if(i === group.length - 1) ids += ")"
						else ids += ","

						item.messages = {}
						item.reads = 0
					})
					if(ids != "(")
					{
						var [ results, err ] = await modeMysql.execute(`select * from messages where group_id in ${ids} group by id desc`)
						results.forEach(item =>
						{
							if(item.acc_reads.split(',').indexOf(`${accData.data.pID}`) === -1)
							{
								group.forEach(group =>
								{
									if(group.id === item.group_id) group.reads ++
								})
							}
						})
					}

					let lastIDS = []
					results.forEach((item, i) =>
					{
						if(lastIDS.indexOf(item.group_id) !== -1) results.splice(i, 1)
						else lastIDS.push(item.group_id)
					})

					results.forEach(item =>
					{
						group.forEach(group =>
						{
							if(group.id === item.group_id) group.messages = item
						})
					})

					ids = "("
					group.forEach((item, i) =>
					{
						ids += item.accounts

						if(i === group.length - 1) ids += ")"
						else ids += ","
					})
					if(ids != "(")
					{
						var [ results, err ] = await modeMysql.execute(`select pID, pName from players where pID in ${ids}`)

						group.forEach(item =>
						{
							item.accountsName = []
							results.forEach(acc =>
							{
								if(item.accounts.indexOf(`${acc.pID}`) !== -1) item.accountsName.push(acc.pName)
							})
						})
					}

					ids = "("
					group.forEach((item, i) =>
					{
						if(item.messages.accID && !isNaN(item.messages.accID))
						{
							ids += item.messages.accID

							if(i === group.length - 1) ids += ")"
							else ids += ","
						}
					})
					if(ids != "(")
					{
						var [ results, err ] = await modeMysql.execute(`select pID, pSkin from players where pID in ${ids}`)

						results.forEach(item =>
						{
							group.forEach(group =>
							{
								if(group.messages.accID === item.pID) group.messages.ownerSkin = item.pSkin
							})
						})
					}
				}

				if(!group.length) res.send('notfound')
				else res.send(group)
			}
			else
			{
				var [ results, err ] = await modeMysql.execute(`select * from messages where group_id = ${modeMysql.escape(data.id)} order by id asc`)

				let messages = results
				if(!messages.length)return res.send('notfound')

				let ids = "("
				messages.forEach((item, i) =>
				{
					ids += item.accID

					if(i === messages.length - 1) ids += ")"
					else ids += ","
				})

				if(ids != "(")
				{
					var [ results, err ] = await modeMysql.execute(`select pID, pSkin from players where pID in ${ids}`)

					results.forEach(item =>
					{
						messages.forEach(mes =>
						{
							if(mes.accID === item.pID) mes.ownerSkin = item.pSkin
						})
					})
				}
				await modeMysql.execute(`update messages set acc_reads = concat(acc_reads, '${modeMysql.escape(accData.data.pID)},') where acc_reads not like '%${accData.data.pID}%' and group_id = ${modeMysql.escape(data.id)}`)

				res.send(messages)
			}
			modeMysql.end()
		}
		else if(pageName === '/roulette')
		{
			res.send({ pDonate: accData.data.pDonate })
		}
	}
});


// Загрузка настроек из other
router.post('/getsettings', (req, res) =>
{
	if(!req.body)return res.sendStatus(400)
	if(!req.cookies.login)return res.send('exit')

	const cookies = JSON.parse(req.cookies.login)
	if(!cookies.id || !cookies.pass || cookies.admin === undefined)return res.send('exit')

	const accData =
	{
		id: cookies.id,
		password: cookies.pass.toUpperCase(),
		admin: cookies.admin,
		server: cookies.server
	}
	checkAccount(accData).then(results =>
	{
		if(results.status === 'error')return res.send('exit')

		accData.data = results.account
		if(accData.data.pAdmin <= 0)return res.send('notrights')

		const settings = loadSettingsJSON()
		res.send(JSON.stringify(settings))
	})
})

// Админ - промокод



module.exports = router;

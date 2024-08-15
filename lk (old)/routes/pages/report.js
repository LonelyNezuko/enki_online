const router = require('express').Router();

const { sendAccountNotf, checkAccount, loadSettingsJSON } = require('../modules/funcs')
const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/report' })
});
router.get('/create', (req, res, next) =>
{
	res.render('index', { pageName: '/report/create' })
});

router.post('/gettags', (req, res) =>
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
		get()
	})

	async function get()
	{
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select tagName from report_tags`)
		modeMysql.end()

		const tags = []
		results.forEach(item =>
		{
			tags.push(item.tagName)
		})
		res.send(tags)
	}
})
router.post('/close', (req, res) =>
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
		close(req.body.id)
	})

	async function close(id)
	{
		if(!id || isNaN(id))return res.send('reportNotFound')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from report where reportID = ${modeMysql.escape(id)}`)
		if(!results.length) return res.send('reportNotFound'), modeMysql.end()

		const report = results[0]

		if(report.reportCreator != accData.data.pID)return res.send('notrights'), modeMysql.end()
		if(report.reportStatus !== 0)return res.send('error'), modeMysql.end()

		var [ results, err ] = await modeMysql.execute(`update report set reportStatus = 3 where reportID = ${modeMysql.escape(id)}`)
		var [ results, err ] = await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageAns, messageReads) values (${modeMysql.escape(id)}, ${modeMysql.escape(accData.pID)}, ${modeMysql.escape(accData.pName)}, 'закрыл жалобу #${id}', 1, '${accData.data.pID},')`)

		var [ results, err ] = await modeMysql.execute(`select siteSettings from players where pID = ${modeMysql.escape(report.reportPlayer)}`)
		if(results.length)
		{
			const siteSettings = JSON.parse(results[0]['siteSettings'])

			if(siteSettings.notf
				&& siteSettings.notf.reportStatus === true) await sendAccountNotf(accData.server, report.reportPlayer, `${report.reportCreatorName} закрыл <a href="/report?id=${id}" class="href-color">жалобу #${id}</a> на Вас.`)
		}

		modeMysql.end()
		res.send()
	}
})
router.post('/create', (req, res) =>
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
		create(!req.body.player ? {} : JSON.parse(req.body.player), req.body.text, req.body.name, req.body.tag)
	})

	async function create(player, text, name, tagName)
	{
		if(!player.id || isNaN(player.id))return res.send('accountNotFound')

		if(!text
			|| !name
			|| text.length < 20
			|| name.length < 10
			|| !tagName
			|| tagName === 'Выберите тег')return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select pName from players where pID = ${modeMysql.escape(player.id)} and pName = ${modeMysql.escape(player.name)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('accountNotFound')
		}

		if(accData.data.pLevel < 2)
		{
			modeMysql.end()
			return res.send('notRights')
		}

		var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagName = ${modeMysql.escape(tagName)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('tagNotfound')
		}
		const tag = results[0]

		var [ results, err ] = await modeMysql.execute(`insert into report (reportCreator, reportCreatorName, reportName, reportPlayer, reportPlayerName, reportTag) values (${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(name)}, ${modeMysql.escape(player.id)}, ${modeMysql.escape(player.name)}, ${modeMysql.escape(tag.tagID)})`)
		const insertID = results['insertId']

		var [ results, err ] = await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageAns, messageReads, messageImages) values (${modeMysql.escape(insertID)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, 'создал жалобу #${insertID}', 1, '${accData.data.pID},', '')`)
		var [ results, err ] = await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageReads, messageImages) values (${modeMysql.escape(insertID)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(text)}, '${accData.data.pID},', '')`)

		var [ results, err ] = await modeMysql.execute(`select siteSettings from players where pID = ${modeMysql.escape(player.id)}`)
		if(results.length)
		{
			const siteSettings = JSON.parse(results[0]['siteSettings'])

			if(siteSettings.notf
				&& siteSettings.notf.reportCreate === true) await sendAccountNotf(accData.server, player.id, `На Вас была создана <a href="/report?id=${insertID}" class="href-color">жалоба #${insertID}</a> от ${accData.data.pName}`)
		}

		modeMysql.end()
		res.send({ insertID: insertID, creatorName: accData.data.pName })
	}
})
router.post('/create/getaccounts', (req, res) =>
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
		get(req.body.text, req.body.type)
	})

	async function get(text, type)
	{
		if(!text
			|| !type)return res.send('notfound')

		if(type === 'nick')
		{
			if(text.length < 4)return res.send('notfound'), modeMysql.end()
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select pID, pName from players where pName like ${modeMysql.escape(text + '%')} limit 5`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send('notfound')
			}

			modeMysql.end()
			res.send(results)
		}
		else
		{
			if(isNaN(text))return res.send('notfound')
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select pID, pName from players where pID = ${modeMysql.escape(parseInt(text))} limit 5`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send('notfound')
			}

			modeMysql.end()
			res.send(results)
		}
	}
})
router.post('/ans', (req, res) =>
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
		ans(!req.body.data ? {} : JSON.parse(req.body.data))
	})

	async function ans(data)
	{
		if(!data
			|| !data.text
			|| !data.reportID
			|| isNaN(data.reportID))return res.send('error')
		if(data.text < 4)return res.send('length')


		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from report where reportID = ${modeMysql.escape(data.reportID)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notFound')
		}
		const report = results[0]

		if(report.reportStatus !== 0)
		{
			modeMysql.end()
			return res.send('errorupdate')
		}

		if(report.reportCreator != accData.data.pID
			&& report.reportPlayer != accData.data.pID)
		{
			modeMysql.end()
			return res.send('notFound')
		}
		await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageReads) values (${modeMysql.escape(data.reportID)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(data.text)}, '${accData.data.pID}')`)

		// if(accData.data.pID !== report.reportCreator) await sendAccountNotf(accData.server, report.reportCreator, `В Вашей <a href="/report?id=${data.reportID}", class="href-color">жалобе #${data.reportID}</a> было оставлено новое сообщение от ${accData.data.pName}`)
 	//  	if(accData.data.pID !== report.reportPlayer) await sendAccountNotf(accData.server, report.reportPlayer, `В <a href="/report?id=${data.reportID}", class="href-color">жалобе #${data.reportID}</a> на Вас было оставлено новое сообщение от ${accData.data.pName}`)

		modeMysql.end()
		res.send({ reportCreator: report.reportCreator, reportPlayer: report.reportPlayer, answer: accData.data.pName })
	}
})

// router.post('/tags/create', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)

// 	async function create(data)
// 	{
// 		if(!data
// 			|| !data.name
// 			|| !data.color
// 			|| !data.admin
// 			|| isNaN(data.admin)
// 			|| data.admin < 1 || data.admin > 6
// 			|| data.name.length < 1 || data.name.length > 30
// 			|| !/^#[0-9A-F]{6}$/i.test(data.color))return res.send('error')

// 		var accData =
// 		{
// 			id: JSON.parse(req.cookies.login).id,
// 			pass: JSON.parse(req.cookies.login).pass
// 		}
// 		var modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

// 		var [ results, err ] = await modeMysql.execute(`select pName from players where pID = ${modeMysql.escape(accData.id)} and pPassword = ${modeMysql.escape(accData.pass)}`)
// 		if(!results.length)return res.send('exit'), modeMysql.end()

// 		const accountData = results[0]

// 		var [ results, err ] = await modeMysql.execute(`select aLevel from admins where aPlayerID = ${modeMysql.escape(accData.id)}`)
// 		if(!results.length)return res.send('exit'), modeMysql.end()

// 		var settings = loadSettingsJSON()
// 		if(results[0]['aLevel'] < settings.access.report.tag.create)return res.send('notAdmin'), modeMysql.end()

// 		modeMysql.end()
// 		const dbhandle = await mysql.createConnection(dbhandleConfig)

// 		var [ results, err ] = await dbhandle.execute(`select * from report_tags where tagName = ${dbhandle.escape(data.name)}`)
// 		if(results.length) return res.send('nameReserved'), dbhandle.end()

// 		var [ results, err ] = await dbhandle.execute(`insert into report_tags (tagName, tagCreator, tagCreatorName, tagColor, tagAdmin) values (${dbhandle.escape(data.name)}, ${dbhandle.escape(accData.id)}, ${dbhandle.escape(accountData.pName)}, ${dbhandle.escape(data.color)}, ${dbhandle.escape(data.admin)})`)

// 		dbhandle.end()
// 		return res.send()
// 	}
// 	create(req.body)
// })

router.post('/get-unread', (req, res) =>
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
		func()
	})

	async function func()
	{
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from report where reportCreator = ${modeMysql.escape(accData.data.pID)} or reportPlayer = ${modeMysql.escape(accData.data.pID)}`)
		if(!results.length)return res.send([])

		let ids = "("
		results.forEach((item, i) =>
		{
			ids += item.reportID

			if(i === results.length - 1) ids += ")"
			else ids += ","
		})
		if(ids != "(") var [ results, err ] = await modeMysql.execute(`select * from report_messages where messageReport in ${ids} and messageReads not like '%${accData.data.pID}%'`)
		modeMysql.end()

		res.send(results)
	}
})

module.exports = router;

const router = require('express').Router();

const { sendAccountNotf, checkAccount, loadSettingsJSON } = require('../modules/funcs')
const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

const fs = require('fs')
const path = require('path')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/admin' })
});
router.get('/promo', (req, res, next) =>
{
	res.render('index', { pageName: '/admin/promo' })
});
router.get('/realty', (req, res, next) =>
{
	res.render('index', { pageName: '/admin/realty' })
});
router.get('/account', (req, res, next) =>
{
	res.render('index', { pageName: '/admin/account' })
});
router.get('/report', (req, res, next) =>
{
	res.render('index', { pageName: '/admin/report' })
});
router.get('/settings', (req, res, next) =>
{
	res.render('index', { pageName: '/admin/settings' })
});

router.post('/promo', (req, res, next) =>
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
		func(req.body.id)
	})

	async function func(id)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')

		if(!id || isNaN(id))return res.send('notfound')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from promocodes where promoID = ${modeMysql.escape(id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}
		const promoData = results[0]

		promoData.promoCreator =
		{
			name: promoData.promoCreator,
			id: 0
		}

		var [ results, err ] = await modeMysql.execute(`select pID from players where pName = ${modeMysql.escape(promoData.promoCreator.name)}`)
		if(results.length) promoData.promoCreator.id = results[0]['pID']

		promoData.promoNameUpdate =
		{
			name: promoData.promoNameUpdate,
			id: 0
		}
		if(parseInt(promoData.promoTimeUpdate))
		{
			var [ results, err ] = await modeMysql.execute(`select pID from players where pName = ${modeMysql.escape(promoData.promoNameUpdate.name)}`)
			if(results.length) promoData.promoNameUpdate.id = results[0]['pID']
		}

		modeMysql.end()
		return res.send(promoData)
	}
})
router.post('/promo-actives', (req, res, next) =>
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
		func(req.body)
	})

	async function func(data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(!data.id || isNaN(data.id))return res.send('notfound')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select promoName from promocodes where promoID = ${modeMysql.escape(data.id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}
		const promo = results[0]

		var searchText = ''
		if(data.search != undefined && data.search.length) searchText = `and pName like '${data.search}%'`

		var [ results, err ] = await modeMysql.execute(`select pName, pSkin, pLevel, pRegDate, pRegIP, pIP from players where pPromoName = ${modeMysql.escape(promo.promoName)} ${searchText}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('not')
		}

		modeMysql.end()
		return res.send(results)
	}
})
router.post('/promo-remove', (req, res, next) =>
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
		func(req.body.id)
	})

	async function func(id)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(!id || isNaN(id))return res.send('notfound')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select promoName from promocodes where promoID = ${modeMysql.escape(id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}

		modeMysql.end()
		return res.send(results[0].promoName)
	}
})

router.post('/promo/create', (req, res, next) =>
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
		func(req.body.data == undefined ? undefined : JSON.parse(req.body.data))
	})

	async function func(data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')

		if(data == undefined
			|| data.name == undefined
			|| data.level == undefined
			|| data.maxActives == undefined
			|| data.items == undefined
			|| typeof data.items != "object")return res.send('error')

		if(data.name.length < 3
			|| data.level < 1 || data.level > 100
			|| data.maxActives < 0 || data.maxActives > 100000)return res.send('error')

		var
			items = [],

			error = false,
			notCount = 0

		data.items.forEach(item =>
		{
			var type = 0

			if(item.type == 'Ничего')
			{
				type = 0
				notCount ++
			}
			else if(item.type == 'Деньги') type = 1
			else if(item.type == 'Аксессуар') type = 2
			else error = true

			if(item.value == undefined) item.value = 0
			if(type != 0
				&& item.value < 1 || item.value > 1000000000) error = true

			if((item != 1 || item != 2)
				&& (item.value === undefined || isNaN(item.value))) error = true

			items.push({ type: type, value: item.value })
		})
		if(error
			|| notCount == 4)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from promocodes where promoName = ${modeMysql.escape(data.name)}`)
		if(results.length)
		{
			modeMysql.end()
			return res.send('errorName')
		}

		var [ results, err ] = await modeMysql.execute(`insert into promocodes (promoCreator, promoName, promoLevel, promoMaxActives, promoSlot1, promoSlot2, promoSlot3, promoSlot4) values (${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(data.name)}, ${modeMysql.escape(data.level)}, ${modeMysql.escape(data.maxActives)}, '${items[0].type},${items[0].value}', '${items[1].type},${items[1].value}', '${items[2].type},${items[2].value}', '${items[3].type},${items[3].value}')`)
		if(err != undefined)
		{
			modeMysql.end()
			return res.send('error')
		}

		modeMysql.end()
		return res.send({ id: results['insertId'] })
	}
})
router.post('/promo/save', (req, res, next) =>
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
		func(req.body.data === undefined ? undefined : JSON.parse(req.body.data))
	})

	async function func(data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')

		if(data == undefined
			|| data.id == undefined
			|| data.name == undefined
			|| data.level == undefined
			|| data.maxActives == undefined
			|| data.items == undefined
			|| typeof data.items != "object")return res.send('error')

		if(data.name.length < 3
			|| data.level < 1 || data.level > 100
			|| data.maxActives < 0 || data.maxActives > 100000)return res.send('error')

		var
			items = [],

			error = false,
			notCount = 0

		data.items.forEach(item =>
		{
			var type = 0

			if(item.type == 'Ничего')
			{
				type = 0
				notCount ++
			}
			else if(item.type == 'Деньги') type = 1
			else if(item.type == 'Аксессуар') type = 2
			else error = true

			if(item.value == undefined) item.value = 0
			if(type != 0
				&& item.value < 1 || item.value > 1000000000) error = true

			if((item != 1 || item != 2)
				&& (item.value === undefined || isNaN(item.value))) error = true

			items.push({ type: type, value: item.value })
		})
		if(error
			|| notCount == 4)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select promoTimeUpdate from promocodes where promoID = ${modeMysql.escape(data.id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('error')
		}
		if(parseInt(results[0]['promoTimeUpdate']) + 300000 > Date.now())
		{
			modeMysql.end()
			return res.send('time')
		}

		var [ results, err ] = await modeMysql.execute(`update promocodes set promoTimeUpdate = '${Date.now()}', promoNameUpdate = '${accData.data.pName}', promoName = ${modeMysql.escape(data.name)}, promoLevel = ${modeMysql.escape(data.level)}, promoMaxActives = ${modeMysql.escape(data.maxActives)}, promoSlot1 = '${items[0].type},${items[0].value}', promoSlot2 = '${items[1].type},${items[1].value}', promoSlot3 = '${items[2].type},${items[2].value}', promoSlot4 = '${items[3].type},${items[3].value}' where promoID = ${modeMysql.escape(data.id)}`)

		modeMysql.end()

		if(err != undefined)return res.send('error')
		return res.send()
	}
})

router.post('/promo/remove', (req, res, next) =>
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
		func(req.body.id)
	})

	async function func(id)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(!id || isNaN(id))return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
		var [ results, err ] = await modeMysql.execute(`delete from promocodes where promoID = ${modeMysql.escape(id)}`)

		modeMysql.end()
		if(err != undefined)return res.send('error')

		return res.send()
	}
})

router.post('/account/logs', (req, res, next) =>
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
		func(req.body.userid, req.body.time == undefined ? undefined : JSON.parse(req.body.time))
	})

	async function func(userid, time)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(time == undefined
			|| userid == undefined
			|| isNaN(userid))return res.send('notfound')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select *,convert(time, char) from logs where userid = ${modeMysql.escape(userid)} and time < convert(${modeMysql.escape(time.to)}, datetime) and time > convert(${modeMysql.escape(time.from)}, datetime) order by time desc`)
		modeMysql.end()

		if(!results.length)return res.send('notfound')

		results.forEach((item, i) =>
		{
			results[i].time = results[i]['convert(time, char)'].replace(' ', 'T')
		})
		res.send(results)
	}
})


router.post('/report/ans', (req, res) =>
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
		func(!req.body.data ? {} : JSON.parse(req.body.data))
	})

	async function func(data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')

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

		// if((!report.reportStatus
		// 	&& admin < settings.access.report.ans.open)
		// 	|| (report.reportStatus == 3
		// 		&& admin < settings.access.report.ans.close)
		// 	|| ((report.reportStatus == 1 || report.reportStatus == 2)
		// 		&& admin < settings.access.report.ans.other)
		// 	|| (report.reportStatus == 4
		// 		&& admin < settings.access.report.ans.pending))return res.send('notAdmin'), modeMysql.end()

		await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageAdmin, messageReads) values (${modeMysql.escape(data.reportID)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(data.text)}, 1, '${accData.data.pID},')`)
		modeMysql.end()

		// await sendAccountNotf(accData.server, report.reportCreator, `В Вашей <a href="/report?id=${data.reportID}", class="href-color">жалобе #${data.reportID}</a> было оставлено новое сообщение от ${accData.data.pName}`)
 		// await sendAccountNotf(accData.server, report.reportPlayer, `В <a href="/report?id=${data.reportID}", class="href-color">жалобе #${data.reportUD}</a> на Вас было оставлено новое сообщение от ${accData.data.pName}`)

		res.send()
	}
})
router.post('/report/status', (req, res) =>
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
		func(req.body)
	})

	async function func(data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(!data
			|| !data.status
			|| !data.id
			|| isNaN(data.id)
			|| !data.statusName)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from report where reportID = ${modeMysql.escape(data.id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}
		const report = results[0]

		await modeMysql.execute(`update report set reportStatus = ${modeMysql.escape(data.status)}, reportArchive = ${data.status == 3 ? "1" : "0"} where reportID = ${modeMysql.escape(data.id)}`)
		await modeMysql.execute(`insert into report_messages (messageReport, messageCreator, messageCreatorName, messageText, messageAns, messageReads) values (${modeMysql.escape(data.id)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, '������� ������ ������ �� ${data.statusName}${data.status == 3 ? ". ������ ���������� � �����." : ""}', 1, '${accData.data.pID},')`)

		var [ results, err ] = await modeMysql.execute(`select siteSettings from players where pID = ${modeMysql.escape(report.reportCreator)}`)
		if(results.length)
		{
			const siteSettings = JSON.parse(results[0]['siteSettings'])

			if(siteSettings.notf
				&& siteSettings.notf.reportStatusMy === true) await sendAccountNotf(accData.server, report.reportCreator, `Статус Вашей <a href="/report?id=${data.id}", class="href-color">жалобы #${data.id}</a> был изменен на '${data.type}'`)
		}
		var [ results, err ] = await modeMysql.execute(`select siteSettings from players where pID = ${modeMysql.escape(report.reportPlayer)}`)
		if(results.length)
		{
			const siteSettings = JSON.parse(results[0]['siteSettings'])

			if(siteSettings.notf
				&& siteSettings.notf.reportStatus === true) await sendAccountNotf(accData.server, report.reportPlayer, `Статус <a href="/report?id=${data.id}", class="href-color">жалобы #${data.id}</a> на Вас был изменен на '${data.type}'`)
		}

		modeMysql.end()
		res.send()
	}
})

router.post('/settings/save/', (req, res, next) =>
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
		func(req.body.type, req.body.data)
	})

	async function func(type, data)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')
		if(accData.data.pAdmin < 6)return res.send('notadmin')

		if(data == undefined
			|| type == undefined)return res.send('error')
		data = JSON.parse(data)

		if(type === 'report')
		{
			if(data.ans.open < 1 || data.ans.open > 6
				|| data.ans.close < 1 || data.ans.close > 6
				|| data.ans.other < 1 || data.ans.other > 6
				|| data.ans.pending < 1 || data.ans.pending > 6)return res.send('error')
		}
		else if(type === 'promo')
		{
			if(data.create < 1 || data.create > 6
				|| data.save < 1 || data.save > 6
				|| data.remove < 1 || data.remove > 6)return res.send('error')
		}
		else if(type === 'view')
		{
			if(data.main < 1 || data.main > 6
				|| data.accounts < 1 || data.accounts > 6
				|| data.promo < 1 || data.promo > 6
				|| data.realty < 1 || data.realty > 6
				|| data.report < 1 || data.report > 6
				|| data.reportTags < 1 || data.reportTags > 6
				|| data.admStats < 1 || data.admStats > 6)return res.send('error')
		}
		else return res.send('error')

		var settings = loadSettingsJSON()
		settings.admin[type] = data

		fs.writeFileSync(path.join(__dirname, '../../') + 'bin/settings.json', JSON.stringify(settings), 'utf-8')
		return res.send()
	}
})

router.post('/report/tags/delete', (req, res, next) =>
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
		func(req.body.id)
	})

	async function func(id)
	{
		if(accData.data.pAdmin <= 0)return res.send('notrights')

		const settings = loadSettingsJSON()
		if(accData.data.pAdmin < settings.admin.report.tag.delete)return res.send('notadmin')

		if(!id || isNaN(id))return res.send('error')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID = ${modeMysql.escape(id)}`)
		if(!results.length)return res.send('update'), modeMysql.end()

		const tag = results[0]
		if(tag.tagCreator != accData.data.pID
			&& accData.data.pAdmin < 6)return res.send('notAdmin'), modeMysql.end()

		await modeMysql.execute(`delete from report_tags where tagID = ${modeMysql.escape(id)}`)
		await modeMysql.execute(`update report set reportTag = 0 where reportTag = ${modeMysql.escape(id)}`)

		modeMysql.end()
		return res.send()
	}
})

module.exports = router;

const router = require('express').Router();

const { sendServerCommand, sendAccountNotf, checkAccount } = require('../modules/funcs')
const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/fraction' })
});
router.get('/application', (req, res, next) =>
{
	res.render('index', { pageName: '/fraction/application' })
});
router.get('/applications', (req, res, next) =>
{
	res.render('index', { pageName: '/fraction/applications' })
});
router.get('/applications/edit', (req, res, next) =>
{
	res.render('index', { pageName: '/fraction/applications/edit' })
});

router.post('/applications/save-settings', (req, res) =>
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
		save(req.body.status, req.body.level)
	})

	async function save(status, level)
	{
		if(!status || !level
			|| status < 0 || status > 1
			|| isNaN(level))return res.send('error')

		if(accData.data.pFraction == -1)return res.send('returnURLFraction')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select frLeader from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('fractionNotFound')
		}

		const fraction = results[0]
		if(fraction.frLeader != accData.data.pID)
		{
			modeMysql.end()
			return res.send('notRights')
		}

		let save = { status: status, level: level }
		var [ results, err ] = await modeMysql.execute(`update fractions set frSiteApp = ${modeMysql.escape(JSON.stringify(save))} where frID = ${modeMysql.escape(accData.data.pFraction)}`)

		modeMysql.end()
		res.send()
	}
})
router.post('/applications/save-forms', (req, res) =>
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
		save(req.body.forms ? JSON.parse(req.body.forms) : undefined)
	})

	async function save(forms)
	{
		if(!forms
			|| !Array.isArray(forms)
			|| !forms.length)return res.send('error')

		if(accData.data.pFraction == -1)return res.send('returnURLFraction')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select frLeader from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('fractionNotFound')
		}
		const fraction = results[0]
		if(fraction.frLeader != accData.data.pID)
		{
			modeMysql.end()
			return res.send('notRights')
		}

		let errorStatus = false
		forms.forEach(item =>
		{
			if(!item.type || !item.name || item.important === undefined || !item.elements || !Array.isArray(item.elements)) errorStatus = false
			else if(item.elements.length)
			{
				item.elements.forEach(elemItem =>
				{
					if(!elemItem.name) errorStatus = false
				})
			}
		})
		if(errorStatus)
		{
			modeMysql.end()
			return res.send('error')
		}
		var [ results, err ] = await modeMysql.execute(`select frID from fraction_forms where frID = ${modeMysql.escape(accData.data.pFraction)}`)

		if(!results.length) await modeMysql.execute(`insert into fraction_forms (frID, frForms) values (${modeMysql.escape(accData.data.pFraction)}, ${modeMysql.escape(JSON.stringify(forms))})`)
		else await modeMysql.execute(`update fraction_forms set frForms = ${modeMysql.escape(JSON.stringify(forms))} where frID = ${modeMysql.escape(accData.data.pFraction)}`)

		modeMysql.end()
		res.send()
	}
})


router.post('/application/go', (req, res) =>
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
		func(!req.body.forms ? undefined : JSON.parse(req.body.forms), req.body.fraction)
	})

	async function func(forms, fracName)
	{
		if(!forms || !forms.length)return res.send('error')

		if(accData.data.pFraction != -1)return res.send('returnURLFraction')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select frID, frSiteApp from fractions where frName = ${modeMysql.escape(fracName)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('fractionNotFound')
		}
		const fraction = results[0]

		if(!JSON.parse(fraction.frSiteApp).status)
		{
			modeMysql.end()
			return res.send('fractionNotStatus')
		}
		if(!JSON.parse(fraction.frSiteApp).level > accData.data.pLevel)
		{
			modeMysql.end()
			return res.send('level')
		}

		var [ results, err ] = await modeMysql.execute(`select frForms from fraction_forms where frID = ${modeMysql.escape(fraction.frID)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('fractionNotForms')
		}

		const loadForms = JSON.parse(results[0]['frForms'])
		if(loadForms.length != forms.length)
		{
			modeMysql.end()
			return res.send('error')
		}

		let formsError = false
		forms.forEach((item, i) =>
		{
			if(!item.type
				|| !item.name
				|| item.important === undefined) formsError = true
			else
			{
				if(item.type != loadForms[i].type
					|| item.name != loadForms[i].name
					|| item.important != loadForms[i].important) formsError = true
				else
				{
					if(item.important)
					{
						if((item.type === 'input' || item.type === 'checkbox')
							&& (!item.value
								|| !item.value.length)) formsError = true
						else if(item.type === 'radio'
							&& !item.value) formsError = true
					}
				}
			}
		})
		if(formsError)
		{
			modeMysql.end()
			return res.send('error')
		}

		// forms.forEach((item, i) =>
		// {
		// 	if(item.type === 'radio')
		// 	{
		// 		loadForms.forEach(elem =>
		// 		{
		// 			if(elem.type === 'radio')
		// 			{
		// 				if(elem.elements.indexOf(item.value) == -1) formsError = true
		// 			}
		// 		})
		// 	}
		// 	else if(item.type === 'checkbox')
		// 	{
		// 		loadForms.forEach(elem =>
		// 		{
		// 			if(elem.type === 'checkbox')
		// 			{
		// 				item.value.forEach(elem2 =>
		// 				{
		// 					if(elem.elements.indexOf(elem2) == -1) formsError = true
		// 				})
		// 			}
		// 		})
		// 	}
		// })

		// console.log(formsError)
		// if(formsError)
		// {
		// 	modeMysql.end()
		// 	return res.send('error')
		// }

		await modeMysql.execute(`insert into fraction_apps (appCreator, appCreatorName, appFrac, appForms) values (${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(fraction.frID)}, ${modeMysql.escape(JSON.stringify(forms))})`)

		modeMysql.end()
		res.send()
	}
})
router.post('/application/close', (req, res) =>
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
		if(accData.data.pFraction != -1)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		await modeMysql.execute(`delete from fraction_apps where appCreator = ${modeMysql.escape(accData.data.pID)}`)
		await modeMysql.execute(`update players set siteFracAppTiming = '${Date.now()}' where pID = ${modeMysql.escape(accData.data.pID)}`)

		modeMysql.end()
		res.send()
	}
})

router.post('/applications/status', (req, res) =>
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
		func(req.body.id, req.body.status, req.body.reason)
	})

	async function func(id, status, reason)
	{
		if(accData.data.pFraction == -1)return res.send('error')
		if(!id || isNaN(id) || status === undefined || (status === 2 && reason === undefined))return res.send('notfound')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select frLeader, frName from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('error')
		}

		const fraction = results[0]
		if(fraction.frLeader !== accData.data.pID)
		{
			modeMysql.end()
			return res.send('error')
		}

		var [ results, err ] = await modeMysql.execute(`select appCreator from fraction_apps where appID = ${modeMysql.escape(id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notfound')
		}
		const app = results[0]

		var [ results, err ] = await modeMysql.execute(`select pID, pFraction, pOnline from players where pID = ${modeMysql.escape(app.appCreator)}`)
		if(!results.length)
		{
			await modeMysql.execute(`delete from fraction_apps where appID = ${modeMysql.escape(id)}`)

			modeMysql.end()
			return res.send('notfound')
		}
		const account = results[0]

		if(account.pFraction != -1)
		{
			await modeMysql.execute(`delete from fraction_apps where appID = ${modeMysql.escape(id)}`)

			modeMysql.end()
			return res.send('playerisfraction')
		}
		await modeMysql.execute(`update fraction_apps set appStatus = ${modeMysql.escape(status)}, appEditor = ${modeMysql.escape(accData.data.pID)}, appEditorName = ${modeMysql.escape(accData.data.pName)}, appEditDate = CURRENT_TIMESTAMP, appEditReason = ${modeMysql.escape(reason === undefined ? "" : reason)} where appID = ${modeMysql.escape(id)}`)

		if(account.pOnline == -1) await modeMysql.execute(`update players set pFraction = ${modeMysql.escape(accData.data.pFraction)}, pRank = 1 where pID = ${modeMysql.escape(app.appCreator)}`)
		else await sendServerCommand(accData.server, "player.fraction.set", `${account.pID};${accData.data.pFraction};1`)

		res.send({ appCreator: app.appCreator, frName: fraction.frName })

		if(status === 2)
		{
			if(!reason.length) await sendAccountNotf(accData.server, app.appCreator, `Ваша заявка #${id} во фракцию ${fraction.frName} была отклонена без причины!`)
			else await sendAccountNotf(accData.server, app.appCreator, `Ваша заявка #${id} во фракцию ${fraction.frName} была отклонена. Причина: ${reason}`)
		}
		else if(status === 1) await sendAccountNotf(accData.server, app.appCreator, `Ваша заявка #${id} во фракцию ${fraction.frName} была одобрена.`)

		modeMysql.end()
	}
})

router.post('/settings/save-access', (req, res) =>
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
		if(!data
			|| !data.app
			|| !data.app.view
			|| !data.app.view.type
			|| !data.app.view.players
			|| !data.app.view.rank || isNaN(data.app.view.rank)
			|| !data.app.edit
			|| !data.app.edit.type
			|| !data.app.edit.players
			|| !data.app.edit.rank || isNaN(data.app.edit.rank)
			|| !data.app.status
			|| !data.app.status.type
			|| !data.app.status.players
			|| !data.app.status.rank || isNaN(data.app.status.rank))return res.send('error')

		if(accData.data.pFraction == -1)return res.send('notrights')
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select frLeader, siteSettings from fractions where frID = ${modeMysql.escape(accData.data.pFraction)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('notrights')
		}

		const fraction = results[0]
		if(fraction.frLeader != accData.data.pID)
		{
			modeMysql.end()
			return res.send('notrights')
		}

		fraction.siteSettings = JSON.parse(fraction.siteSettings)
		fraction.siteSettings.access = data

		await modeMysql.execute(`update fractions set siteSettings = ${modeMysql.escape(JSON.stringify(fraction.siteSettings))} where frID = ${modeMysql.escape(accData.data.pFraction)}`)

		modeMysql.end()
		res.send()
	}
})

module.exports = router;

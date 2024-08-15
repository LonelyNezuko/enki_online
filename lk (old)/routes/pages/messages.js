const router = require('express').Router();

const { sendAccountNotf, checkAccount } = require('../modules/funcs')
const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/messages' })
});

router.post('/add', (req, res) =>
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
		func(req.body.id, req.body.text)
	})

	async function func(id, text)
	{
		if(id === undefined || id === null || isNaN(id)
			|| !text.length)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from messages_group where id = ${modeMysql.escape(id)} and accounts like '%${accData.data.pID}%'`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('return')
		}

		let accounts = results[0]['accounts'].split(',')
		accounts = accounts.splice(accounts.indexOf(`${accData.data.pID}`) - 1, 1)

		await modeMysql.execute(`insert into messages (group_id, accID, accName, text, acc_reads) values (${modeMysql.escape(id)}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(text)}, '${accData.data.pID},')`)
		modeMysql.end()

		// await sendAccountNotf(accData.server, accounts, `${accData.data.pName} оставил новое сообщение в <a href="/messages?id=${id}">Личной переписке</a>`)
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
		func(req.body.player, req.body.title, req.body.text)
	})

	async function func(player, title, text)
	{
		if(player === undefined || player === null || isNaN(player)
			|| !text.length || !title.length
			|| player === accData.data.pID
			|| accData.data.pAdmin <= 0)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select * from players where pID = ${modeMysql.escape(player)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('error')
		}

		var [ results, err ] = await modeMysql.execute(`insert into messages_group (title, ownerID, accounts) values (${modeMysql.escape(title)}, ${modeMysql.escape(accData.data.pID)}, '${accData.data.pID},${player}')`)
		await modeMysql.execute(`insert into messages (group_id, accID, accName, text, acc_reads) values (${modeMysql.escape(results['insertId'])}, ${modeMysql.escape(accData.data.pID)}, ${modeMysql.escape(accData.data.pName)}, ${modeMysql.escape(text)}, '${accData.data.pID},')`)

		modeMysql.end()
		await sendAccountNotf(accData.server, player, `${accData.data.pName} начал с Вами <a href="/messages?id=${results['insertId']}">новый диалог</a>`)

		res.send({ id: results['insertId'] })
	}
})
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

		var [ results, err ] = await modeMysql.execute(`select * from messages_group where accounts like '%${accData.data.pID}%'`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send([])
		}

		let ids = "("
		results.forEach((item, i) =>
		{
			ids += item.id

			if(i === results.length - 1) ids += ")"
			else ids += ","
		})

		if(ids != "(") var [ results, err ] = await modeMysql.execute(`select * from messages where group_id in ${ids} and acc_reads not like '%${accData.data.pID}%'`)
		modeMysql.end()

		res.send(results)
	}
})

module.exports = router;

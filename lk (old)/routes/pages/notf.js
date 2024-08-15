const router = require('express').Router();

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')
const { checkAccount } = require('../modules/funcs')

router.post('/remove', (req, res) =>
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
		remove()
	})

	async function remove()
	{
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
		var [ results, err ] = await modeMysql.execute(`delete from notf where notfAccount = ${modeMysql.escape(accData.data.pID)}`)

		modeMysql.end()
		res.send()
	}
})
router.post('/get', (req, res) =>
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
		get(req.body.all)
	})

	async function get(all)
	{
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])
		var [ results, err ] = await modeMysql.execute(`select * from notf where notfAccount = ${modeMysql.escape(accData.data.pID)} ${all == 1 ? "" : "and notfRead = 0"} order by notfID desc`)

		if(all == 1) await modeMysql.execute(`update notf set notfRead = 1 where notfAccount = ${modeMysql.escape(accData.data.pID)}`)

		modeMysql.end()
		res.send(results)
	}
})

module.exports = router;

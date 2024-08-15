const router = require('express').Router();

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')
const { checkAccount } = require('../modules/funcs')

const sha256 = require('js-sha256')

// router.post('/', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)
// 	if(req.cookies.login !== undefined)return res.send('exit')

// 	check(req.body)
// 	async function check(data)
// 	{
// 		if(!data
// 			|| !data.name
// 			|| !data.pass
// 			|| !data.email)return res.send('error')

// 		const modeMysql = await mysql.createConnection(modeMysqlConfig)

// 		var [ results, err ] = await modeMysql.execute(`select pName from players where pName = ${modeMysql.escape(data.name)}`)
// 		if(results.length)
// 		{
// 			modeMysql.end()
// 			return res.send('notfound')
// 		}

// 		var [ results, err ] = await modeMysql.execute(`select pEmail from players where pEmail = ${modeMysql.escape(data.email)}`)
// 		modeMysql.end()

// 		if(results.length)return res.send('isemail')

// 		if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(data.pass)
// 			|| data.pass.length > 64)return res.send('password not valid')
// 		if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email.toLowerCase())
// 			|| data.email.length > 144)return res.send('email not valid')

// 		const dbhandle = await mysql.createConnection(dbhandleConfig)

// 		require('modules/getPassword')
// 		const code = genPassword(24)

// 		await dbhandle.execute(`delete from accounts_reg where name = ${dbhandle.escape(data.name)} and email = ${dbhandle.escape(data.email)}`)
// 		await dbhandle.execute(`insert into accounts_reg (name, pass, email, code) value (${dbhandle.escape(data.name)}, ${dbhandle.escape(data.pass)}, ${dbhandle.escape(data.email)}, ${dbhandle.escape(code)})`)

// 		dbhandle.end()
// 		res.send()
// 	}
// })
// router.post('/code', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)
// 	if(req.cookies.login !== undefined)return res.send('exit')

// 	check(req.body)
// 	async function check(data)
// 	{
// 		if(!data
// 			|| !data.name
// 			|| !data.pass
// 			|| !data.email
// 			|| !data.code)return res.send('error')

// 		const modeMysql = await mysql.createConnection(modeMysqlConfig)

// 		var [ results, err ] = await modeMysql.execute(`select pName from players where pName = ${modeMysql.escape(data.name)}`)
// 		if(results.length)
// 		{
// 			modeMysql.end()
// 			return res.send('notfound')
// 		}

// 		var [ results, err ] = await modeMysql.execute(`select pEmail from players where pEmail = ${modeMysql.escape(data.email)}`)
// 		if(results.length)
// 		{
// 			modeMysql.end()
// 			return res.send('isemail')
// 		}

// 		if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(data.pass)
// 			|| data.pass.length > 64)
// 		{
// 			modeMysql.end()
// 			return res.send('password not valid')
// 		}
// 		if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email.toLowerCase())
// 			|| data.email.length > 144)
// 		{
// 			modeMysql.end()
// 			return res.send('email not valid')
// 		}

// 		const dbhandle = await mysql.createConnection(dbhandleConfig)
// 		var [ results, err ] = await dbhandle.execute(`select * from accounts_reg where name = ${dbhandle.escape(data.name)} and email = ${dbhandle.escape(data.email)} and pass = ${dbhandle.escape(data.pass)}`)
// 		if(!results.length)
// 		{
// 			dbhandle.end()
// 			modeMysql.end()

// 			return res.send('code notfound')
// 		}

// 		await dbhandle.execute(`delete from accounts_reg where name = ${dbhandle.escape(data.name)} and email = ${dbhandle.escape(data.email)}`)
// 		if(results[0]['code'] !== data.code)
// 		{
// 			dbhandle.end()
// 			modeMysql.end()

// 			return res.send('code')
// 		}

// 		const ip = req.ip.replace('::ffff:', '')
// 		var [ results, err ] = await modeMysql.execute(`insert into players (pName, pEmail, pPassword, pRegIP) values (${modeMysql.escape(data.name)}, ${modeMysql.escape(data.email)}, ${modeMysql.escape(sha256(data.pass))}, ${modeMysql.escape(ip)})`)

// 		modeMysql.end()
// 		dbhandle.end()

// 		res.send(JSON.stringify({ id: results['insertId'], pass: sha256(data.pass), admin: 0 }))
// 	}
// })
// router.post('/continue', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)
// 	if(!req.cookies.login)return res.send('exit')

// 	const cookies = JSON.parse(req.cookies.login)
// 	if(!cookies.id || !cookies.pass || cookies.admin === undefined)return res.send('exit')

// 	const accData =
// 	{
// 		id: cookies.id,
// 		password: cookies.pass.toUpperCase(),
// 		admin: cookies.admin,
		// server: cookies.server
// 	}
// 	checkAccount(accData).then(results =>
// 	{
// 		if(results.status === 'error')return res.send('exit')

// 		accData.data = results.account
// 		check(req.body.sex, req.body.age, !req.body.spawn ? undefined : JSON.parse(req.body.spawn))
// 	})

// 	async function check(sex, age, spawn)
// 	{
// 		if(sex === undefined
// 			|| age === undefined
// 			|| spawn === undefined
// 			|| typeof spawn !== 'object'
// 			|| parseInt(spawn[0]) < 0 || parseInt(spawn[0]) > 2
// 			|| parseInt(spawn[1]) < 0 || parseInt(spawn[1]) > 2
// 			|| isNaN(age) || parseInt(age) < 18 || parseInt(age) > 85
// 			|| isNaN(sex) || parseInt(sex) < 0 || parseInt(sex) > 1)return res.send('error')
// 		if(!accData.data.pRegContinue)return res.send('no')

// 		const modeMysql = await mysql.createConnection(modeMysqlConfig)

// 		const skins =
// 		[
// 			[ 18, 19, 45, 97 ],
// 			[ 138, 139, 140, 145 ]
// 		]

// 		spawn = `${spawn[0]},${spawn[1]}`

// 		require('modules/randomInt')
// 		await modeMysql.execute(`update players set pSkin = ${modeMysql.escape(skins[sex][randomInt(skins[sex].length)])}, pSex = ${modeMysql.escape(parseInt(sex))}, pAge = ${modeMysql.escape(parseInt(age))}, pPlace = ${modeMysql.escape(spawn)}, pRegContinue = 0 where pID = ${modeMysql.escape(accData.data.pID)}`)

// 		modeMysql.end()
// 		res.send()
// 	}
// })

module.exports = router;

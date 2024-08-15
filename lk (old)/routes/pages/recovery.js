const router = require('express').Router();
const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

// router.post('/check', (req, res) =>
// {
// 	if(!req.body)return res.sendStatus(400)

// 	async function check(name, email, code)
// 	{
// 		if(!name || !email || !code || code.length != 5)return res.send('error')

// 		const dbhandle = await mysql.createConnection(dbhandleConfig)

// 		var [ results, err ] = await dbhandle.execute(`select * from accounts_recovery where accName = ${dbhandle.escape(name)} and accMail = ${dbhandle.escape(email)}`)
// 		if(!results.length)
// 		{
// 			dbhandle.end()
// 			return res.send('notFound')
// 		}

// 		await dbhandle.execute(`delete from accounts_recovery where accName = ${dbhandle.escape(name)}`)
// 		dbhandle.end()

// 		if(parseInt(results[0]['accTime']) + 120000 < +new Date())return res.send('timeExpired')
// 		if(results[0]['accCode'] != code)return res.send('codeNotTrue')

// 		require('../modules/getPassword')

// 		let pass = genPassword(20)
// 		if(!pass || pass === null) pass = "12345609876"

// 		modeMysql = await mysql.createConnection(modeMysqlConfig)
// 		console.log(`pass: ${pass}`)

// 		await modeMysql.execute(`update players set pPassword = ${modeMysql.escape(sha256(pass))} where pName = ${modeMysql.escape(name)}`)
// 		modeMysql.end()

// 		// mail.sendMail({
// 		// 	from: host.email,
// 		// 	to: email,
// 		// 	subject: 'UCP Enki RP: Восстановление аккаунта',
// 		// 	html: `<body style="width: 100%">
// 		// 			<div class="wrapper" style="margin: 0 auto; width: calc(80% - 40px); border: 2px solid silver; padding: 20px; border-radius: 8px;">
// 		// 				<div class="header" style="width: calc(100% - 30px); background-color: #2688ae; border-radius: 10px; padding: 15px; color: white; margin-bottom: 20px; text-align: center; font-size: 22px; text-transform: uppercase;">Восстановление аккаунта</div>
// 		// 				<div class="body" style="font-size: 18px;">
// 		// 					На Вашем аккаунте <span style="background-color: #05b895; border-radius: 7px; padding: 5px; color: white;">${name}</span> был изменен пароль путем восстановления.<br>
// 		// 					Вы можете войти в свой аккаунт на сайте через новый пароль: <br><br>

// 		// 					<span style="background-color: #6882e4; border-radius: 6px; padding: 10px; color: white;">${pass}</span><br><br>

// 		// 					Если Вы не восстановливали аккаунт, то срочно измените пароль от Вашей почты и на сайте от аккаунта.
// 		// 					<div class="body-desc" style="margin-top: 30px; color: grey; font-size: 15px; text-align: center;">Enki Role Play (c) 2020</div>
// 		// 				</div>
// 		// 			</div>
// 		// 		</body>` }, (error, info) =>
// 		// 	{
// 		// 		if(error)
// 		// 		{
// 		// 			res.send('error')
// 		// 			return console.log(error)
// 		// 		}
// 		// 		res.send('success')
// 		// 	});
// 		res.send('success')
// 	}
// 	check(req.body.name, req.body.email, req.body.code)
// })
// router.post('', (req, res) =>
// {
// 	if(!req.body)return res.sendStatus(400)

// 	async function check(name, email)
// 	{
// 		if(!name || !email)return res.send('error')

// 		const modeMysql = await mysql.createConnection(modeMysqlConfig)

// 		var [ results, err ] = await modeMysql.execute(`select * from players where pName = ${modeMysql.escape(name)} and pEmail = ${modeMysql.escape(email)}`)
// 		modeMysql.end()

// 		if(!results.length)return res.send('notFound')

// 		const dbhandle = await mysql.createConnection(dbhandleConfig)
// 		await dbhandle.execute(`delete from accounts_recovery where accName = ${dbhandle.escape(name)}`)

// 		require('../modules/randomInt')

// 		var code = 1000 + randomInt(99999)
// 		if(code.length > 5) code.substring(0, code.length - 1)

// 		var [ results, err ] = await dbhandle.execute(`insert into accounts_recovery (accName, accMail, accCode, accTime) values (${modeMysql.escape(name)}, ${modeMysql.escape(email)}, '${code}', '${+new Date()}')`)

// 		dbhandle.end()
// 		// mail.sendMail({
// 		// 	from: host.email,
// 		// 	to: email,
// 		// 	subject: 'UCP Enki RP: Восстановление аккаунта',
// 		// 	html: `<body style="width: 100%">
// 		// 			<div class="wrapper" style="margin: 0 auto; width: calc(80% - 40px); border: 2px solid silver; padding: 20px; border-radius: 8px;">
// 		// 				<div class="header" style="width: calc(100% - 30px); background-color: #2688ae; border-radius: 10px; padding: 15px; color: white; margin-bottom: 20px; text-align: center; font-size: 22px; text-transform: uppercase;">Восстановление аккаунта</div>
// 		// 				<div class="body" style="font-size: 18px;">
// 		// 					Данное письмо пришло, потому что Ваш аккаунт <span style="background-color: #05b895; border-radius: 7px; padding: 5px; color: white;">${name}</span> пытаются восстановить.<br>
// 		// 					Для продолжения восстановления аккаунта введите данный код в всплывающее окно на сайте. <br><br>

// 		// 					Код: <span style="background-color: #6882e4; border-radius: 6px; padding: 10px; color: white;">${code}</span><br><br>

// 		// 					Если Вы не пытаетесь восстановить свой аккаунт - проигнорируйте это письмо и никому не сообщайте данный код.

// 		// 					<div class="body-desc" style="margin-top: 30px; color: grey; font-size: 15px; text-align: center;">Enki Role Play (c) 2020</div>
// 		// 				</div>
// 		// 			</div>
// 		// 		</body>` }, (error, info) =>
// 		// 	{
// 		// 		if(error)
// 		// 		{
// 		// 			res.send('error')
// 		// 			return console.log(error)
// 		// 		}
// 		// 		res.send('success')
// 		// 	});

// 		res.send('success')
// 	}
// 	check(req.body.name, req.body.email)
// })

module.exports = router;

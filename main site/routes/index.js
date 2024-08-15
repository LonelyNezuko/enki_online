var express = require('express');
var router = express.Router();

const request = require('request')

const { mysql, dbhandleConfig, modeMysqlConfig } = require('../bin/mysql')
const host = require('../bin/host')

const sha256 = require('js-sha256')


router.get('/', (req, res, next) =>
{
	res.render('index')
});
// router.get('/start', (req, res, next) =>
// {
// 	res.render('start');
// });
router.get('/donate', (req, res, next) =>
{
	res.render('donate');
});
router.get('/news', (req, res, next) =>
{
	res.render('news');
});

router.get('/discord', (req, res, next) =>
{
	res.redirect("https://discord.com/invite/X2UTsPDnvQ")
});
router.get('/launcher', (req, res, next) =>
{
	async function counter() {
		const dbhandleMysql = await mysql.createConnection(dbhandleConfig)
		await dbhandleMysql.execute(`update launcherCounter set download = download + 1`)

		dbhandleMysql.end()
	}

	counter()
	res.redirect("https://download.enki-rp.ru/launcher.exe")
});

router.get('/document/oferta', (req, res, next) =>
{
	res.render('document_oferta');
});
router.get('/document/privacy_policy', (req, res, next) =>
{
	res.render('document_privacy_policy');
});

// post
router.post('/get_news', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)

	if(req.body.id
		&& !isNaN(req.body.id))
	{
		request.get(`https://api.vk.com/method/wall.getById?posts=-199644005_${req.body.id}&access_token=70d2f63370d2f63370d2f6336073c26615770d270d2f63313c18ccebc4d221dbc0bb080&v=5.131`, (err, ress, body) =>
		{
			body = JSON.parse(body)

			if(!body.response.length) res.send('notfound')
			else res.send(JSON.stringify(body.response[0]))
		})
	}
	else
	{
		request.get('https://api.vk.com/method/wall.get?owner_id=-199644005&access_token=70d2f63370d2f63370d2f6336073c26615770d270d2f63313c18ccebc4d221dbc0bb080&v=5.131', (err, ress, body) =>
		{
			body = JSON.parse(body)

			if(!body.response.items) res.send('notfound')
			else res.send(JSON.stringify(body.response.items))
		})
	}
})
router.post('/get_last_news', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)

	request.get('https://api.vk.com/method/wall.get?owner_id=-199644005&count=5&access_token=70d2f63370d2f63370d2f6336073c26615770d270d2f63313c18ccebc4d221dbc0bb080&v=5.131', (err, ress, body) =>
	{
		body = JSON.parse(body)

		if(!body.response.items) res.send('notfound')
		else res.send(JSON.stringify(body.response.items))
	})
})
router.post('/get_servers', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)

	async function get() {
		const servers = [
			{ hostname: 'Enki Online', status: 1, ip: '88.208.241.199', port: '7777', maxplayers: 1000, players: 0 }
		]

		const modeMysql = await mysql.createConnection(modeMysqlConfig[0])
		var [ results, err ] = await modeMysql.execute(`select COUNT(*) from players where pOnline != -1`)

		if(!results.length) servers[0].status = 0
		else servers[0].players = results[0]['COUNT(*)']

		var [ results, err ] = await modeMysql.execute(`select botsOnline from other`)
		if(results.length) servers[0].players += results[0]['botsOnline']

		var [ results, err ] = await modeMysql.execute(`select serverOtherNames from other`)

		if(!results.length) servers[0].status = 0
		else servers[0].hostname = servers[0].hostname + ' | ' + results[0]['serverOtherNames']

		console.log(servers)

		modeMysql.end()
		res.send(JSON.stringify(servers))
	}
	get()
})

// router.post('/', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)

// 	if(req.body.type && req.body.group_id
// 		&& req.body.type === 'confirmation'
// 		&& req.body.group_id === 199644005) res.send('4fb02a55')
// });


// router.post('/donate/check', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)
//
// 	async function check(data)
// 	{
// 		if(data.ik_inv_st === 'success')
// 		{
// 			const dbhandle = await mysql.createConnection(dbhandleConfig)
//
// 			const pmID = data.ik_pm_no.replace('id_', '')
// 			var [ results, error ] = await dbhandle.execute(`select server, donate_id from donates where id = ${dbhandle.escape(parseInt(pmID))}`)
// 			if(!results.length)
// 			{
// 				dbhandle.end()
// 				return res.send(400)
// 			}
//
// 			const
// 				server = results[0]['server'],
// 				donate_id = results[0]['donate_id']
//
// 			if(server < 0 || server >= modeMysqlConfig.length)
// 			{
// 				await dbhandle.execute(`delete from donates where id = ${dbhandle.escape(parseInt(pmID))}`)
//
// 				dbhandle.end()
// 				return res.send(400)
// 			}
//
// 			await dbhandle.execute(`delete from donates where id = ${dbhandle.escape(parseInt(pmID))}`)
// 			dbhandle.end()
//
// 			const modeMysql = await mysql.createConnection(modeMysqlConfig[server])
//
// 			var [ results, error ] = await modeMysql.execute(`select donSuccess from donates where donID = ${modeMysql.escape(parseInt(donate_id))}`)
// 			if(!results.length)
// 			{
// 				modeMysql.end()
// 				return res.send(400)
// 			}
//
// 			if(results[0]['donSuccess'] === 0) await modeMysql.execute(`update donates set donSuccess = 1 where donID = ${modeMysql.escape(parseInt(donate_id))}`)
// 			modeMysql.end()
//
// 			res.send(200)
// 		}
// 		else if(data.ik_inv_st === 'fail' || data.ik_inv_st === 'canceled')
// 		{
// 			const dbhandle = await mysql.createConnection(dbhandleConfig)
//
// 			const pmID = data.ik_pm_no.replace('id_', '')
// 			var [ results, error ] = await dbhandle.execute(`select server, donate_id from donates where id = ${dbhandle.escape(parseInt(pmID))}`)
// 			if(!results.length)
// 			{
// 				dbhandle.end()
// 				return res.send(200)
// 			}
//
// 			const
// 				server = results[0]['server'],
// 				donate_id = results[0]['donate_id']
//
// 			await dbhandle.execute(`delete from donates where id = ${dbhandle.escape(parseInt(pmID))}`)
// 			dbhandle.end()
//
// 			if(server < 0 || server >= modeMysqlConfig.length)return res.send(200)
// 			const modeMysql = await mysql.createConnection(modeMysqlConfig[server])
//
// 			await modeMysql.execute(`delete from donates where donID = ${modeMysql.escape(parseInt(donate_id))}`)
// 			modeMysql.end()
//
// 			res.send(200)
// 		}
// 	}
// 	check(req.body)
// });
// router.post('/donate/payment', (req, res, next) =>
// {
// 	if(!req.body)return res.sendStatus(400)
//
// 	async function donate(data)
// 	{
// 		if(!data
// 			|| !data.name
// 			|| !data.sum
// 			|| data.name.length < 4 || data.name.length > 24
// 			|| data.sum < 1 || data.sum > 100000000
// 			|| data.server === undefined || isNaN(data.server) || data.server === null || data.server < 0 || data.server >= modeMysqlConfig.length)return res.send('error')
//
// 		const modeMysql = await mysql.createConnection(modeMysqlConfig[data.server])
//
// 		var [ results, err ] = await modeMysql.execute(`select pID from players where pName = ${modeMysql.escape(data.name)}`)
// 		if(!results.length)
// 		{
// 			modeMysql.end()
// 			return res.send('notfound')
// 		}
// 		const account = results[0]
//
// 		// var [ results, error ] = await modeMysql.execute(`select * from donates where donPlayerID = ${modeMysql.escape(account.pID)} and donSuccess = 0`)
// 		// if(results.length)
// 		// {
// 		// 	modeMysql.end()
// 		// 	return res.send('abort')
// 		// }
//
// 		var [ results, error ] = await modeMysql.execute(`insert into donates (donPlayerID, donSum, donToken) values (${modeMysql.escape(account.pID)}, ${modeMysql.escape(data.sum)}, '')`)
//
// 		let desc = `Пополнение счета ${data.name}`
// 		modeMysql.end()
//
// 		const dbhandle = await mysql.createConnection(dbhandleConfig)
// 		var [ results, error ] = await dbhandle.execute(`insert into donates (server, donate_id) values (${modeMysql.escape(data.server)}, ${modeMysql.escape(results['insertId'])})`)
//
// 		dbhandle.end()
//
// 		const url = `https://sci.interkassa.com?ik_co_id=${host.kassa.id}&ik_pm_no=id_${results['insertId']}&ik_cur=RUB&ik_am=${data.sum}&ik_desc=${desc}`
// 		res.send({ url: url })
// 	}
//
// 	donate(req.body)
// });
router.post('/donate/loadPrices', (req, res, next) =>
{
	if(!req.body)return res.sendStatus(400)

	async function load(server)
	{
		if(server === undefined || isNaN(server) || server === null || server < 0 || server >= modeMysqlConfig.length)return res.send('notfound')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[server])
		var [ results, err ] = await modeMysql.execute(`select donateSettings from other`)

		let donateSettings = []
		if(results.length) donateSettings = results[0]['donateSettings'].split(',')

		modeMysql.end()
		res.send(donateSettings);
	}
	load(req.body.server)
});

module.exports = router;

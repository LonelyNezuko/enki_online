const router = require('express').Router();

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')
const { checkAccount, sendServerCommand } = require('../modules/funcs')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/account' })
});
router.get('/settings', (req, res, next) =>
{
	res.render('index', { pageName: '/account/settings' })
});

router.post('/settings/accept-google-auth', (req, res) =>
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
		func(req.body.code)
	})

	async function func(code)
	{
		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select pGoogleAuth, pGoogleAuthAccept from players where pID = ${modeMysql.escape(accData.data.pID)}`)
		const acc = results[0]

		if(acc.pGoogleAuth !== '-')
		{
			modeMysql.end()
			return res.send('fatal')
		}

		// const check = authenticator.generateToken(acc.pGoogleAuthAccept);
		// // const check = speakeasy.totp.verify({
		// // 	secret: acc.pGoogleAuthAccept,
		// // 	encoding: 'base32',
		// // 	token: code });

		// console.log(check, acc.pGoogleAuthAccept, code)
		// if(check !== code)
		// {
		// 	modeMysql.end()
		// 	return res.send('error')
		// }

		modeMysql.end()
		res.send()
	}
})

router.post('/settings/save/notf', (req, res) =>
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
		func(!req.body.data ? undefined : JSON.parse(req.body.data))
	})

	async function func(data)
	{
		if(!data
			|| data.statusMyReports === undefined
			|| data.statusReports === undefined)return res.send('error')

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select siteSettings from players where pID = ${modeMysql.escape(accData.data.pID)}`)
		const siteSettings = JSON.parse(results[0]['siteSettings'])

		siteSettings.notf =
		{
			reportStatusMy: data.statusMyReports,
			reportStatus: data.statusReports
		}
		await modeMysql.execute(`update players set siteSettings = ${modeMysql.escape(JSON.stringify(siteSettings))} where pID = ${modeMysql.escape(accData.data.pID)}`)

		modeMysql.end()
		res.send()
	}
})

router.post('/settings/realty-pay', (req, res) =>
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
		if(!info
			|| data.info === undefined
			|| data.cash === undefined
			|| (data.cash !== 'cash' && data.cash !== 'bank'))return res.send('error')

		data.info = JSON.parse(data.info)
		if(data.info === undefined
			|| (data.info.type !== 'house'
				&& data.info.type !== 'biz'
				&& data.info.type !== 'vehicle')
			|| data.info.id === undefined || isNaN(data.info.id)
			|| data.info.nalog === undefined || data.info.nalog < 0)return res.send('error')
		if(data.info.nalog === 0)return res.send('no nalog')

		if((data.cash === 'cash'
			&& accData.data.pCash < data.info.nalog)
			|| (data.cash === 'bank'
				&& (accData.data.pBank === 0 || accData.data.pBankCash < data.info.nalog)))return res.send({ message: 'no cash', data: { cash: accData.data.pCash, bank: accData.data.pBank === 0 ? 0 : accData.data.pBankCash } })

		const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

		var [ results, err ] = await modeMysql.execute(`select ${data.info.type === 'house' ? 'houseNalog, houseOwner' : data.info.type === 'biz' ? 'bNalog, bOwner' : 'vehNalog, vehType, vehTypeID'} from ${data.info.type === 'house' ? 'houses' : data.info.type === 'biz' ? 'biz' : 'vehicles'} where ${data.info.type === 'house' ? 'houseID' : data.info.type === 'biz' ? 'bID' : 'vehID'} = ${modeMysql.escape(data.info.id)}`)
		if(!results.length)
		{
			modeMysql.end()
			return res.send('error')
		}

		const result = results[0]
		if((data.info.type === 'house'
			&& result.houseOwner !== accData.data.pID)
			|| (data.info.type === 'biz'
				&& result.bOwner === accData.data.pID)
			|| (data.info.type === 'vehicle'
				&& result.vehType !== 1
				&& result.vehNalog !== accData.data.pID))
		{
			modeMysql.end()
			return res.send('error')
		}

		if((data.info.type === 'house'
			&& result.houseNalog === data.info.nalog)
			|| (data.info.type === 'biz'
				&& result.bNalog === data.info.nalog)
			|| (data.info.type === 'vehicle'
				&& result.vehNalog === data.info.nalog))
		{
			modeMysql.end()
			return res.send('no nalog')
		}

		if(accData.data.pOnline !== -1) sendServerCommand(accData.server, `player.${data.cash === 'cash' ? 'givecash' : 'bank.cash'}`, `${accData.data.pOnline};-${data.info.nalog}`)
		else await modeMysql.execute(`update players set ${data.cash === 'cash' ? 'pCash' : 'pBankCash'} = ${data.cash === 'cash' ? 'pCash' : 'pBankCash'} - ${modeMysql.escape(data.info.nalog)} where pID = ${modeMysql.escape(accData.data.pID)}`)

		sendServerCommand(accData.server, 'realty.nalog.reset', `${data.info.type === 'house' ? 0 : data.info.type === 'biz' ? 1 : 2};${data.info.id}`)

		modeMysql.end()
		res.send({ data: { cash: accData.data.pCash - data.info.nalog, bank: accData.data.pBank === 0 ? 0 : accData.data.pBankCash - data.info.nalog } })
	}
})

module.exports = router;

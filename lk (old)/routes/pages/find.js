const router = require('express').Router();

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')
const { checkAccount, loadSettingsJSON } = require('../modules/funcs')

router.get('/', (req, res, next) =>
{
	res.render('index', { pageName: '/find' })
});

router.post('/', (req, res) =>
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
		func(req.body.type, req.body.search, !req.body.data ? {} : JSON.parse(req.body.data))
	})

	async function func(type, search, data)
	{
		if(accData.data.pAdmin <= 0)
		{
			if(type !== 'account')return res.send({ message: 'notrights' })

			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select pID, pName, pLevel, pExp, pSkin, pHealth, pSatiety, pThirst, pCash, pBankCash, pDeposit, pFraction, pRank, pSex, pWarn, pSetSpawn, pSetSpawnAdm, pWedding, pSkills, pWeddingName, pOnline, pAcs from players where pName = ${modeMysql.escape(search)}`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send('notfound')
			}
			const account = results[0]

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

			// if(account.pPromoName != '-')
			// {
			// 	var [ results, err ] = await modeMysql.execute(`select promoName, promoID from promocodes where promoName = ${modeMysql.escape(account.pPromoName)}`)
			//
			// 	if(results.length) account.pPromoName = { name: results[0]['promoName'], id: results[0]['promoID'] }
			// 	else account.pPromoName = '-'
			// }

			modeMysql.end()
			res.send({ message: 'open', data: account, type: 'account' })

			return false
		}

		const settings = loadSettingsJSON()
		if(type === 'account'
			|| type === 'promo'
			|| type === 'realty')
		{
			let name = 'pName'
			let base = 'players'

			if(type === 'promo')
			{
				if(settings.admin.view.promo > accData.data.pAdmin)return res.send({ message: "notadmin" })

				base = 'promocodes'
				name = 'promoName'
			}
			else if(type === 'realty')
			{
				if(settings.admin.view.realty > accData.data.pAdmin)return res.send({ message: "notadmin" })
				if(!data.realty)return res.send({ message: 'error' })

				if(data.realty === 'house')
				{
					base = 'houses'
					name = 'houseID'
				}
				else if(data.realty === 'biz')
				{
					base = 'biz'
					name = 'bID'
				}
				else if(data.realty === 'veh')
				{
					base = 'vehicles'
					name = 'vehID'
				}
			}
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			var [ results, err ] = await modeMysql.execute(`select * from ${base} where ${name} like ${modeMysql.escape(search + '%')} limit 25`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send({ message: "notfound" })
			}

			if(type === 'account')
			{
				results.forEach((item, i) =>
				{
					delete results[i].pPassword
					delete results[i].invModel
					delete results[i].invCustom
					delete results[i].invQuantity

					delete results[i].pQuests
					delete results[i].pCompletedQuest
				})
			}
			modeMysql.end()

			// if(results.length === 1) res.send({ message: "open", type: type, data: results[0] })
			// else res.send({ message: "list", type: type, data: results })

			res.send({ message: "list", type: type, data: results })
		}
		else if(type === 'report')
		{
			if(settings.admin.view.report > accData.data.pAdmin)return res.send({ message: "notadmin" })
			const modeMysql = await mysql.createConnection(modeMysqlConfig[accData.server])

			let tagStr = ''
			if(data.tag)
			{
				if(data.tag === 'Избранное'
					&& data.reportLikes)
				{
					let ids = ''
					data.reportLikes.forEach(item =>
					{
						ids += item + ','
					})
					ids = ids.substring(0, ids.length - 1)

					if(ids != '') tagStr += ` and reportID in (${ids})`
					else
					{
						modeMysql.end()
						return res.send({ message: 'notfound' })
					}
				}
				else if(data.tag === 'Архив') tagStr += ' and reportArchive = 1'
				else if(data.tag === 'Без тега') tagStr += ' and reportTag = 0'
				else
				{
					var [ results, err ] = await modeMysql.execute(`select tagID from report_tags where tagName = ${modeMysql.escape(data.tag)} limit 1`)
					if(results.length) tagStr += ` and reportTag = ${results[0]['tagID']}`
				}
			}

			if(data.tag != 'Архив'
				&& data.tag != 'Избранное') tagStr += ' and reportArchive = 0'

			var [ results, err ] = await modeMysql.execute(`select * from report where reportName like ${modeMysql.escape(search + '%')}${tagStr} limit 25`)
			if(!results.length)
			{
				modeMysql.end()
				return res.send({ message: "notfound" })
			}
			const reports = results

			let tagIds = ""
			reports.forEach((item, i) =>
			{
				if(i == 0) tagIds += item.reportTag
				else tagIds += "," + item.reportTag

				item.reportTagName = "Без тега"
				item.reportTagColor = "#000000"
			})

			var [ results, err ] = await modeMysql.execute(`select * from report_tags where tagID in (${tagIds})`)
			reports.forEach(item =>
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
			modeMysql.end()

			// if(reports.length === 1) res.send({ message: "open", type: 'report', data: reports[0] })
			// else res.send({ message: "list", type: 'report', data: reports })

			res.send({ message: "list", type: 'report', data: reports })
		}
	}
})

module.exports = router

const host = require('../bin/host')

var express = require('express')
var router = express.Router();

const path = require('path')

const { dbhandleConfig, modeMysqlConfig, mysql } = require('../bin/mysql.js')
const sha256 = require('js-sha256')

// const speakeasy = require('speakeasy')
// const qrcode = require('qrcode')

// const authenticator = require('authenticator')

// get
router.get('/', (req, res, next) =>
{
	let empty = false
	for(var key in req.query) empty = true

	if(!empty)return res.send({ status: "error", response: 'No parameters' })

	const
		method = req.query.method,
		params = req.query.params,
		secretKey = req.query.secret

	if(method === undefined
		|| method.length === 0)return res.send({ status: "error", response: 'Method not specified' })
	if(params === undefined)return res.send({ status: "error", response: 'No parameters specified' })

	empty = false
	for(var key in params) empty = true

	if(typeof params !== 'object'
		|| Array.isArray(params)
		|| !empty)return res.send({ status: "error", response: 'No parameters specified' })

	async function func()
	{
		switch(method)
		{
			case 'sha256':
			{
				if(params.data === undefined)return res.send({ status: "error", response: 'Invalid params data' })
				return res.send({ status: "success", data: { result: sha256(params.data) } })
			}
			case 'account_login':
			{
				if(params.server === undefined
					|| params.server < 0 || params.server >= modeMysqlConfig.length)return res.send({ status: "error", response: 'Invalid server' })

				if(params.nickname === undefined
					|| params.password === undefined)return res.send({ status: "error", response: "No Nickname or Password specified" })

				const modeMysql = await mysql.createConnection(modeMysqlConfig[params.server])

				var [ results, err ] = await modeMysql.execute(`select pPassword, pID from players where pName = ${modeMysql.escape(params.nickname)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Account not found' })
				}
				const account = results[0]

				if(account.pPassword.toLowerCase() !== params.password.toLowerCase())
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Incorrect password' })
				}

				var [ results, err ] = await modeMysql.execute(`select aLevel from admins where aPlayerID = ${modeMysql.escape(account.pID)}`)

				if(results.length) account.pAdmin = results[0]['aLevel']
				else account.pAdmin = 0

				modeMysql.end()
				return res.send({ status: "success", data: { accID: account.pID, admin: account.pAdmin, password: account.pPassword } })
			}
			case 'account_check':
			{
				if(params.server === undefined
					|| params.server < 0 || params.server >= modeMysqlConfig.length)return res.send({ status: "error", response: 'Invalid server' })

				if(params.nickname === undefined
					|| params.password === undefined
					|| params.admin === undefined || isNaN(params.admin) || params.admin < 0)return res.send({ status: "error", response: "No Nickname or Password specified" })

				const modeMysql = await mysql.createConnection(modeMysqlConfig[params.server])

				var [ results, err ] = await modeMysql.execute(`select pPassword, pID from players where pName = ${modeMysql.escape(params.nickname)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Account not found' })
				}
				const account = results[0]

				if(account.pPassword.toLowerCase() !== params.password.toLowerCase())
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Incorrect password' })
				}

				var [ results, err ] = await modeMysql.execute(`select aLevel from admins where aPlayerID = ${modeMysql.escape(account.pID)}`)
				if((!results.length
					&& params.admin > 0)
					|| (params.admin !== results[0]['aLevel']))
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Not the correct admin level' })
				}

				modeMysql.end()
				return res.send({ status: "success" })
			}
			case 'account_valid':
			{
				if(params.server === undefined
					|| params.server < 0 || params.server >= modeMysqlConfig.length)return res.send({ status: "error", response: 'Invalid server' })
				if(params.nickname === undefined)return res.send({ status: "error", response: "No Nickname or Password specified" })

				const modeMysql = await mysql.createConnection(modeMysqlConfig[params.server])

				var [ results, err ] = await modeMysql.execute(`select pID from players where pName = ${modeMysql.escape(params.nickname)}`)
				if(!results.length)
				{
					modeMysql.end()
					return res.send({ status: 'error', response: 'Account not found' })
				}

				modeMysql.end()
				return res.send({ status: "success", data: { accID: results[0]['pID'] } })
			}
			case 'news_get':
			{
				const limit = params.limit

				const dbhandle = await mysql.createConnection(dbhandleConfig)

				var [ results, err ] = await dbhandle.execute(`select * from news ${limit !== undefined ? `limit ${limit}` : ''}`)
				if(!results.length)
				{
					dbhandle.end()
					return res.send({ status: 'error', response: 'News Not Found' })
				}

				const news = []
				results.forEach(item =>
				{
					news.push({
						title: item.news_Title,
						desc: item.news_Desc,
						text: item.news_Text,
						likes: item.news_Likes,
						views: item.news_VIews,
						bg: item.news_BG.indexOf("./images/news/") !== -1 ? path.join(__dirname, '../') + 'public/styles/' + item.news_BG.replace('./', '') : item.news_BG,
						date: item.news_Date,
						href: `https://enki-rp.ru/news?id=${item.news_ID}`
					})
				})

				return res.send({ status: 'success', data: news })
			}
		}

		return res.send({ status: "error", response: 'Method not found' })
	}

	return func()
});


module.exports = router;

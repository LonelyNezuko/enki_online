const { dbhandleConfig, modeMysqlConfig, mysql } = require('../../bin/mysql.js')

const fs = require('fs')
const path = require('path')

async function sendServerCommand(server, command, attrs)
{
	const modeMysql = await mysql.createConnection(modeMysqlConfig[server])

	await modeMysql.execute(`insert site_commands (command, attrs) values (${modeMysql.escape(command)}, ${modeMysql.escape(attrs)})`)
	modeMysql.end()

	return true
}
async function sendServerLog(server, id, text)
{
	const modeMysql = await mysql.createConnection(modeMysqlConfig[server])

	if(typeof id !== 'object') await modeMysql.execute(`insert into logs (userid, text) values (${modeMysql.escape(id)}, ${modeMysql.escape(text)})`)
	else
	{
		let str = ''
		id.forEach((item, i) =>
		{
			str += `('${item}', '${text}')`

			if(i !== id.length - 1) str += ','
			else str += ';'
		})

		await modeMysql.execute(`insert into logs (userid, text) values ${str}`)
	}
	modeMysql.end()

	return true
}
async function sendAccountNotf(server, id, text)
{
	if(!id)return false
	if(!text.length)return false

	const modeMysql = await mysql.createConnection(modeMysqlConfig[server])

	if(typeof id !== 'object') await modeMysql.execute(`insert into notf (notfAccount, notfText) values (${modeMysql.escape(id)}, ${modeMysql.escape(text)})`)
	else
	{
		let str = ''
		id.forEach((item, i) =>
		{
			str += `('${item}', '${text}')`

			if(i !== id.length - 1) str += ','
			else str += ';'
		})

		await modeMysql.execute(`insert into notf (notfAccount, notfText) values ${str}`)
	}

	modeMysql.end()
	return true
}
async function checkAccount(data)
{
	if(!data
		|| !data.id || isNaN(data.id) || data.id === null
		|| !data.password || data.admin === undefined
		|| data.server === undefined || isNaN(data.server) || data.server === null || data.server >= modeMysqlConfig.length || data.server < 0)return { status: "error" }
	const modeMysql = await mysql.createConnection(modeMysqlConfig[data.server])

	var [ results, err ] = await modeMysql.execute(`select * from players where pID = ${modeMysql.escape(parseInt(data.id))}`)
	if(!results.length)
	{
		modeMysql.end()
		return { status: "error", message: "account not found" }
	}
	const accData = results[0]

	if(accData.pPassword.toLowerCase() != data.password.toLowerCase())
	{
		modeMysql.end()
		return { status: "error", message: "password not right" }
	}

	var [ results, err ] = await modeMysql.execute(`select aLevel from admins where aPlayerID = ${modeMysql.escape(parseInt(accData.pID))}`)

	if(!results.length
		&& data.admin > 0)return { status: "error", message: "admin not found" }

	if(data.admin > 0
		&& results[0]['aLevel'] != data.admin)
	{
		modeMysql.end()
		return { status: "error", message: "admin level doesn't match" }
	}
	accData.pAdmin = data.admin

	modeMysql.end()
	return { status: "success", account: accData }
}

function loadSettingsJSON()
{
	const results = fs.readFileSync(path.join(__dirname, '../../') + 'bin/settings.json', 'utf-8')

	try { data = JSON.parse(results) }
	catch {
		console.error('settings.json not found')
		return false
	}
	return data
}


module.exports =
{
	sendServerCommand,
	sendServerLog,
	sendAccountNotf,
	checkAccount,
	loadSettingsJSON
}

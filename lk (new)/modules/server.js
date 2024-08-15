const { modeHandle } = require('./mysqlConnection')

const server = {
    sendCMD: async (server, cmd, attrs) =>
    {
        await modeHandle.query(server, `insert into site_commands (command, attrs) values (${modeHandle.format(cmd)}, ${modeHandle.format(attrs)})`)
    },
    sendLog: async (server, id, text) =>
    {
        if(typeof id !== 'object') await modeHandle.query(server, `insert into logs (userid, text) values (${modeHandle.format(id)}, ${modeHandle.format(text)})`)
    	else
    	{
    		let str = ''
    		id.forEach((item, i) =>
    		{
    			str += `('${item}', '${text}')`

    			if(i !== id.length - 1) str += ','
    			else str += ';'
    		})

    		await modeHandle.query(`insert into logs (userid, text) values ${str}`)
    	}
    }
}

module.exports = server

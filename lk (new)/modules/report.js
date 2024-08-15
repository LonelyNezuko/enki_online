const { modeHandle } = require('./mysqlConnection')

const report = {
    getReports: async (server, searchType, searchID) =>
    {
        let results = await modeHandle.query(server, `select * from report where ${searchType} = ${modeHandle.format(searchID)}`)
        if(!results)return []

        return results
    },
    getReport: async (server, repid) =>
    {
        let results = await modeHandle.query(server, `select * from report where reportID = ${modeHandle.format(repid)}`)
        if(!results)return []

        return results
    },
    getReportMessages: async (server, repid) =>
    {
        let results = await modeHandle.query(server, `select * from report_messages where messageReport ${typeof repid === 'string' ? `in ${repid}` : `= ${modeHandle.format(repid)}`}`)
        if(!results)return []

        return results
    }
}

module.exports = report

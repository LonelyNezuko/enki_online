const mysql = require('mysql2/promise');

const dbhandleConfig =
{
    host: "127.0.0.1",
    user: "root",
    database: "enki_site",
    password: ""
}

const modeMysqlConfig =
[
    {
        host: "127.0.0.1",
        user: "root",
        database: "enki",
        password: ""
    }
]

module.exports = { dbhandleConfig, modeMysqlConfig, mysql };

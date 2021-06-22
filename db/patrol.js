const Mysql = require("mysql2/promise");
const dayjs = require("dayjs");
require("dotenv").config();

const sql = Mysql.createPool({
    host: "localhost",
    user: 'root',
    password: process.env.DB_PASS,
    database: "patroldb",
    connectionLimit: 100,
    queueLimit: 0,
    port: 3306
});

const getImgsPatrol = async()=>{
    try
    {
        const query = "SELECT * FROM historico order by id desc";
        const result = await sql.query(query);
        return result[0]
    }
    catch(e)
    {
        console.error(e)
    }
}

module.exports = {getImgsPatrol}
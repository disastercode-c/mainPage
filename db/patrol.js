const Mysql = require("mysql2/promise");
const dayjs = require("dayjs");
require("dotenv").config();

const sql = Mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASS_PATROL,
    database: "patrol",
    connectionLimit: 100,
    queueLimit: 0,
    port: 3306
});

const getImgsPatrol = async()=>{
    try
    {
        const query = "SELECT * FROM historico order by id desc";
        const result = await sql.query(query);
        console.log(result[0])
        return result[0]
    }
    catch(e)
    {
        console.error(e)
    }
}
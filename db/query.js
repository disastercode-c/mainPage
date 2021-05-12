const Mysql = require("mysql2/promise");
const dayjs = require("dayjs");
require("dotenv").config();

const sql = Mysql.createPool({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASS,
  database: "canvasjs_db",
  connectionLimit: 100,
  queueLimit: 0,
  port: 3306,
});

const getTempServ = async () => {
  try {
    const query = "SELECT * FROM rfid ORDER BY EPC ASC";
    const rows = await sql.query(query);
    return rows[0];
  } catch (err) {
    console.log("Error => " + err);
    return err;
  }
};

const getInfoSensor = async () => {
  try {
    const query = "SELECT * FROM sensores LIMIT 1";
    const  rows = await sql.query(query);
    return rows[0];
  } catch (err) {
    console.log("Error => " + err);
    return err;
  }
};

const getStateDoor = async () => {
  try {
    const query = "SELECT * FROM puerta ORDER BY id DESC LIMIT 2";
    const rows = await sql.query(query);
    return rows[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getInfoDoor = async ()=>{
  try{
    const queryTime = 'SELECT MAX(doorTime) as max, fecha FROM puerta WHERE doorState=0 ORDER BY id  DESC';
    const rows = await sql.query(queryTime);
    const queryCount = 'SELECT COUNT(*) as count FROM puerta WHERE doorState = 1'; //total de veces generales que se ha abierto la puerta
    const countOpenDoor = await sql.query(queryCount);
    return{maxTime:rows[0], countOpen:countOpenDoor[0]}
  }catch(e){
    console.log(e)
    return e;
  }
}

const specificInfoServer = async (label) => {
  try {
    const query = `SELECT * FROM historico WHERE epc = '${label}' ORDER BY fecha ASC`;
    const rows = await sql.query(query);
    return rows[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getDataHistoricaAmb = async () => {
  try {
    const queryLastDay = "SELECT MAX(fecha) as fecha from sensoresh";
    const result = await sql.query(queryLastDay);
    const maxFecha = result[0][0].fecha;
    const fecha = `${dayjs(maxFecha).year()}-${dayjs(maxFecha).month() + 1}-${dayjs(maxFecha).date()};`
    const query = `SELECT * from sensoresh WHERE CAST(fecha as date) BETWEEN DATE_SUB('${fecha}', INTERVAL 1 MONTH) AND '${fecha}'`;
    const rows = await sql.query(query);
    return rows[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getHistoricoConFecha = async (fechaInicio, fechaTermino, server1, server2)=>{
    try{
        const query = `SELECT * FROM historico WHERE fecha BETWEEN '${fechaInicio}' AND '${fechaTermino}' AND epc ='${server1}'`;
        const rows = await sql.query(query);
        if(server2){
            const query2 = `SELECT * FROM historico WHERE fecha BETWEEN '${fechaInicio}' AND '${fechaTermino}' AND epc ='${server2}'`;
            const rows2 = await sql.query(query2);
            return {rows:rows[0], rows2: rows2[0]}
        }else{
            return rows[0];
        }
    }
    catch(error){
        console.log(error);
        return error;
    }
}

const getInfoDoorWDate = async (fechaInicio, fechaTermino)=>{
  try{
      const query = `SELECT MAX(doorTime) as max, fecha from puerta where fecha BETWEEN '${fechaInicio}' and '${fechaTermino}'`
      const maxWDate = await sql.query(query);
      const query2 = `SELECT COUNT(*) as count from puerta where fecha BETWEEN '${fechaInicio}' and '${fechaTermino}'`
      const countWDate = await sql.query(query2)
      const query3 = `SELECT SUM(doorState) as sum from puerta where fecha BETWEEN '${fechaInicio}' and '${fechaTermino}'`
      const sumSegs = await sql.query(query3)
      return {maxSeg: maxWDate[0], countOpen: countWDate[0], sumSegs: sumSegs[0]}
  }catch(e){
    console.log(e)
    return e
  }
}

const login = async(username, password)=> {
  try {
      const query = `SELECT * FROM usuarios WHERE nombre = '${username}' AND password = '${password}'` ;
      const rows = await sql.query(query);
      return rows[0][0];
  } catch (err) {
      console.log('ERROR => ' + err);
      return err;
  }
}

const getInfoAlarmas = async()=>{
  try{
    const query = 'Select * FROM alarmas ORDER BY id DESC LIMIT 2';
    const rows = await sql.query(query);
    return rows[0]
  }catch(e){
    return e
  }
}



module.exports = {
  getTempServ,
  getInfoSensor,
  getStateDoor,
  specificInfoServer,
  getDataHistoricaAmb,
  getHistoricoConFecha,
  login,
  getInfoAlarmas,
  getInfoDoor,
  getInfoDoorWDate
};

const dayjs = require("dayjs");
const {getInfoSensor} = require("../db/query")

const getDataAmb = async()=>{
    const info = await getInfoSensor();
    let humedad = info[0].humedad;
    let temperatura = info[0].tmpAmb;
    let ppm = info[0].gas;
    let obj = {humedad: humedad, temperatura:temperatura, ppm: ppm};
    
    return obj;
}

const dateConverter = (result)=>{
    if(result.rows){
        const infoServer1 = result.rows.map((e)=>{
            return {fecha:`${dayjs(e.fecha).date()}-${dayjs(e.fecha).month()+1}-${dayjs(e.fecha).year()}`, temperature: e.temperature};
        });
        const infoServer2 = result.rows2.map((e)=>{
            return {fecha:`${dayjs(e.fecha).date()}-${dayjs(e.fecha).month()+1}-${dayjs(e.fecha).year()}`, temperature: e.temperature};
        })
        return {rows: infoServer1, rows2: infoServer2}
    }else{
        const info = result.map((e)=>{
            return {fecha:`${dayjs(e.fecha).date()}-${dayjs(e.fecha).month()+1}-${dayjs(e.fecha).year()}`, temperature: e.Temperature ? e.Temperature : e.temperature, hora:`${dayjs(e.fecha).hour()}:${dayjs(e.fecha).minute()}:${dayjs(e.fecha).second()}`};
        })
        return info;
    }
}

const getTempServers = (result)=>{
    const info = result.map((e)=>{
        return {EPC: e.EPC, fecha:`${dayjs(e.fecha).date()}-${dayjs(e.fecha).month()+1}-${dayjs(e.fecha).year()}`, Temperature: e.Temperature, }
    })
    return info;
}

const infoDoor = (door)=>{
    let stateDoor;
    let timeDoor;
   if(door[0].doorState == 0){
    stateDoor = "Cerrado";
    timeDoor = door[1].doorTime;
   }else{
    stateDoor = "Abierto"
    timeDoor = door[1].doorTime;
   }
   return {estadoPuerta: stateDoor, tiempo: timeDoor}
}

const convertDateAmb = (amb)=>{
    const info = amb.map((e)=>{
        return {fecha:`${dayjs(e.fecha).date()}-${dayjs(e.fecha).month()+1}-${dayjs(e.fecha).year()}`, tmpAmb: e.tmpAmb, humedad: e.humedad, gas: e.gas}
    })

    return info;
}


module.exports = {getDataAmb, dateConverter, getTempServers, infoDoor,convertDateAmb}
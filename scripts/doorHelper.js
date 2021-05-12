const getDoorStateAndTime = async()=>{
    const {data: stateDoor} = await axios.get("/door");
    return stateDoor;
}

const alertas = async()=>{
    let result = await getDoorStateAndTime();
    if(result[0].doorState == 0){
        alert('Puerta abierta')
    }
}

setInterval(() => {
    alertas();
}, 1000);
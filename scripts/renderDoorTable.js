const renderDoorTable = async()=>{
    let fechaInicio = document.getElementById("initDate").value
    let fechaTermino = document.getElementById("endDate").value

    if(fechaInicio > fechaTermino){
        alert('La fecha de inicio debe ser mayor a la de termino')
    }else if(fechaInicio == fechaTermino){
        alert('Debe ingresar un rango de al menos un día de diferencia')
    }else{
        $("#door").removeClass('d-none')
        const payload = {fechaInicio, fechaTermino}
        const {data} = await axios.post('/puerta', payload);
        
        $("#doorInfo").append(`
        <table class="table table-bordered table-light">
        <thead>
        <tr>
            <th>Nro. Aperturas</th>
            <th>Mayor tiempo puerta Abierta</th>
            <th>Contador puerta abierta en segs.</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td>${data.countOpen[0].count}</td>
                <td>${data.maxSeg[0].max} - ${data.maxSeg[0].fecha}</td>
                <td>${data.sumSegs[0].sum}</td>
            </tr>
        </tbody>
        </table>
        `)
    }
}   

const back = () => {
    let token = localStorage.getItem("token-usuario");
    if (token) {
      window.location = `/home?token=${token}`;
    } else {
      window.location = "/login";
    }
  };
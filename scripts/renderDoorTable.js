const renderDoorTable = ()=>{
    let fechaInicio = document.getElementById("initDate").value
    let fechaTermino = document.getElementById("endDate").value

    if(fechaInicio > fechaTermino){
        alert('La fecha de inicio debe ser mayor a la de termino')
    }else{
        
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
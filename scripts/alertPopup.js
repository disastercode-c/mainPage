toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-full-width",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "5000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

const dataAlert = async()=>{
    const {data: infoAlert} = await axios.get('/alerts');
    let temp1,temp2,mask1,mask2;
    temp1 = infoAlert[0].alarmaTEMP
    temp2 = infoAlert[1].alarmaTEMP
    mask1 = infoAlert[0].alarmaMASK
    mask2 = infoAlert[1].alarmaMASK
    if(temp1 == 1 || temp2 == 1){
        riseAlert('temperatura')
    }
    if(mask1 == 1 || mask2 == 1){
        riseAlert('mascarilla')
    }
}
  
const riseAlert = (tipo)=>{
    if(tipo == 'temperatura'){
        toastr.error('Temperatura registrada elevada','¡ALERTA!')
    }else if(tipo == 'mascarilla'){
        toastr.error('Persona sin mascarilla','¡ALERTA!')
    }
}

//setInterval(dataAlert, 5000);

  
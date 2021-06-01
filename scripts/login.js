
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const login = async () => {
    try {
        if(username.value.length == 0 && password.value.length == 0){
            usernameInput.style.border="1px solid red";
            $("#errmsgu").removeClass("d-none")
            passwordInput.style.border="1px solid red";
            $("#errmsgp").removeClass("d-none")
        }else if(username.value.length == 0){
           usernameInput.style.border="1px solid red";
           $("#errmsgu").removeClass("d-none")
        }else if(password.value.length == 0){
            passwordInput.style.border="1px solid red";
            $("#errmsgp").removeClass("d-none")
        }else {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const payload = { username, password };

            const { data } = await axios.post('/login', payload)
            
            if (data.error) {
                toastr.options = {
                    positionClass: 'toast-top-full-width',
                }
                toastr.error("Usuario y/o Contraseña incorrecto/a", "atención")
            }else{
                const {token} = data
                localStorage.setItem('token-usuario', token)
                window.location = `/Home?token=${token}`
            }
        }
    } catch (err) {
        console.log(err)
        window.location = '/login'
    }
};

usernameInput.addEventListener('focus', ()=>{
    if(usernameInput.style.border="1px solid red"){
        usernameInput.style.border="1px solid #fabe12"
        $("#errmsgu").addClass("d-none")
    }
})

passwordInput.addEventListener('focus', ()=>{
    if(passwordInput.style.border="1px solid red"){
        passwordInput.style.border="1px solid #fabe12"
        $("#errmsgp").addClass("d-none")
    }
})


$("#password").on('keyup', (e)=>{if(e.key === 'Enter' || e.key === 13){
    login();
}})
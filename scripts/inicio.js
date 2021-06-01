
const token = localStorage.getItem('token-usuario');
        if (token) {
            $("#login").addClass('d-none');
            $("#admin").removeClass('d-none');
        } else {
            $("#login").removeClass('d-none');
            $("#admin").addClass('d-none');
        }
        const renderAdmin = () => {
            window.location = `/home?token=${token}`
        }
        const viewContact = () => {
            $("#product").addClass('d-none');
            $("#contact").removeClass('d-none');
            $("#about").addClass('d-none')
            $('#news').addClass('d-none')
        }
        const viewHome = () => {
            $("#product").removeClass('d-none')
            $("#contact").addClass('d-none')
            $("#about").addClass('d-none')
            $('#news').addClass('d-none')
        }
        const viewAbout = () => {
            $("#product").addClass('d-none')
            $("#contact").addClass('d-none')
            $("#about").removeClass('d-none')
            $('#news').addClass('d-none')
        }

        const viewNews = ()=>{
            $('#product').addClass('d-none');
            $('#contact').addClass('d-none');
            $('#about').addClass('d-none');
            $('#news').removeClass('d-none')
        }
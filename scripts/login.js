const login = async () => {
    try {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const payload = { username, password };

        const { data } = await axios.post('/login', payload)
        const { token } = data;
        if (token) {
            localStorage.setItem('token-usuario', token);
            window.location = `/Home?token=${token}`;
        }
    } catch (err) {
        console.log(err)
    }
};
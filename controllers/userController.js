const loginForm = (req, res) => {
    res.render('auth/login', {
        authenticate: true
    });
}


export {
    loginForm
}
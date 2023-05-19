const loginForm = (req, res) => {
    res.render('auth/login', {
    });
}
const signupForm = (req, res) => {
    res.render('auth/signup', {
    });
}


export {
    loginForm,
    signupForm
}
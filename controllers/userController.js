const loginForm = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Log in'
    });
}
const signupForm = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up'
    });
}
const forgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        pageTitle: 'Forgot Password?'
    });
}


export {
    loginForm,
    signupForm,
    forgotPassword
}
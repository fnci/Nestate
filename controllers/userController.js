import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import {JWTGen, idGen} from '../helpers/tokens.js';
import {registerEmail, passwordResetEmail} from '../helpers/emails.js';

const loginForm = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Log in',
        csrfToken: req.csrfToken()
    });
}
const authenticate = async (req, res) => {
    await check('email').trim().isEmail().withMessage('Email is required.').run(req);
    await check('password').notEmpty().withMessage('Password is required.').run(req);
    let result = validationResult(req);
    if(!result.isEmpty()) {
        return res.render('auth/login', {
            pageTitle: 'Log in',
            errors: result.array(),
        })
    }
    const {email, password} = req.body;
    const user = await User.findOne({ where: {email}})
    if(!user) {
        return res.render('auth/login', {
            pageTitle: 'Log in',
            errors: [{msg: 'User doesn\'t exist.'}]
        })
    }
    // Verify if the user is confirm
    if(!user.confirm){
        return res.render('auth/login', {
            pageTitle: 'Log in',
            errors: [{msg: 'The account hasn\'t been confirmed.'}]
        })
    }
    // Check password
    if(!user.verifyPassword(password)){
        return res.render('auth/login', {
            pageTitle: 'Log in',
            errors: [{msg: 'Incorrect password.'}]
        })
    }
    // Authenticate User
     const token = JWTGen({id: user.id, username: user.username});
     return res.cookie('_token', token, {
        httpOnly: true,
        /* secure: true */
     }).redirect('/my-properties')
}

const signupForm = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        csrfToken: req.csrfToken()
    });
}

const register = async (req, res) => {
    // Validation
    await check('username').trim().notEmpty().withMessage('Please enter a username.').run(req);
    await check('email').trim().isEmail().withMessage('Enter a valid email address.').run(req);
    await check('password').isLength({min:8}).withMessage('Password must be at least 8 characters long.').run(req);
    await check('confirmPassword').custom(async (confirmPassword, {req}) => {
        const password = req.body.password;
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if(password !== confirmPassword){
          throw new Error('Passwords didn\'t match.')
        }
      }).run(req)

    let result = validationResult(req);
    // If the form is empty, show messages and not register in to the db
    /* res.json(result.array()) */
    if(!result.isEmpty()) {
        // errors
        return res.render('auth/signup', {
            pageTitle: 'Sign up',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.username,
                email: req.body.email
            }
        })
    }
    const {username, email, password} = req.body;
    const userExists = await User.findOne({where: {email}})
    if(userExists) {
        return res.render('auth/signup', {
            pageTitle: 'Sign up',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'This email is already in use.'}],
            user: {
                name: req.body.username,
                email: req.body.email
            }
        })
    }


    const user = await User.create({
        username,
        email,
        password,
        token: idGen()
    })

    // Sending confirmation email, extract data
    registerEmail({
        name: user.username,
        email: user.email,
        token: user.token
    })

    // Show messages
    res.render('../views/templates/message.pug', {
        page: 'Thanks for signing up!',
        message: 'We send you an email to validate your account'
    })
}

// Account confirmation via email
const confirm = async (req, res) => {
    const {token} = req.params;
    // Verify valid token
    const user = await User.findOne({where: {token}});
    if(!user){
        return res.render('auth/confirm', {
            page: 'Something went wrong',
            message: 'Sorry! We couldn\'t verify your account,',
            error: true
        })
    }

    // Verify account
    user.token = null;
    user.confirm = true;
    await user.save();

    res.render('auth/confirm', {
        page: 'Thanks for signing up!',
        message: 'Account Created successfully! You are in now!'
    });

}
// Forgot password
const forgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        pageTitle: 'Forgot Password?'
    });
}
// Reset password
const resetPassword = async (req, res) => {

    await check('email').trim().isEmail().withMessage('Enter a valid email address.').run(req);

    let result = validationResult(req);
    // If the form is empty, show messages and not register in to the db
    /* res.json(result.array()) */
    if(!result.isEmpty()) {
        // errors
        return res.render('auth/forgot-password', {
            pageTitle: 'Forgot Password?',
            errors: result.array()
        });
    }
    // Search the user existence on the db
    const {email} = req.body;
    const user = await User.findOne({where: {email}});
    if(!user){
        return res.render('auth/forgot-password', {
            pageTitle: 'Forgot Password?',
            errors: [{msg: 'The email does not belong to any user.'}]
        });
    }
    // Generate a token for the forgotten password
    user.token = idGen();
    await user.save();
    // Send email notification
    passwordResetEmail({
        name: user.username,
        email: user.email,
        token: user.token
    });
    // Render the message
    res.render('../views/templates/message.pug', {
        page: 'Reset your password',
        message: 'We have sent you an email to reset your password!'
    })
}

// Send email notification
const checkToken = async (req, res) => {
    const {token} = req.params;
    const user = await User.findOne({where: {token}});
    if(!user){
        return res.render('auth/confirm', {
            page: 'Reset Password',
            message: 'There was an error validating your information,',
            error: true
        })
    }

    // Show form to change password
    res.render('auth/reset-password', {
        page: 'Reset Password',
    })
}
// Render the message
const newPassword = async (req, res) => {
    // Validate Password
    await check('password').isLength({min:8}).withMessage('Password must be at least 8 characters long.').run(req);
    let result = validationResult(req);
    if(!result.isEmpty()) {
        // errors
        return res.render('auth/reset-password', {
            pageTitle: 'Reset Password',
            errors: result.array(),
        })
    }

    const {token} = req.params;
    const {password} = req.body;
    // Identify the user of the change
    const user = await User.findOne({where: {token}})
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( password, salt );
    user.token = null;

    await user.save();

    res.render('auth/confirm', {
        page: 'Password reset successful',
        message: 'The password was saved successfully!'
    })
}



export {
    loginForm,
    authenticate,
    signupForm,
    register,
    confirm,
    forgotPassword,
    resetPassword,
    checkToken,
    newPassword
}
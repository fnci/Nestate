import { check, validationResult } from 'express-validator'
import User from '../models/User.js';
import {idGen} from '../helpers/tokens.js';
import {registerEmail} from '../helpers/emails.js';

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


export {
    loginForm,
    signupForm,
    register,
    confirm,
    forgotPassword
}
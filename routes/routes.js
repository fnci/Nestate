import express from 'express';
const router = express.Router();
import {loginForm, signupForm, register, confirm, forgotPassword} from '../controllers/userController.js'


router.get('/login', loginForm);

router.get('/signup', signupForm);
router.post('/signup', register);

// Dynamic routing with express
router.get('/confirm/:token', confirm);

router.get('/forgot-password', forgotPassword);


export default router;
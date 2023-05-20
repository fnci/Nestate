import express from 'express';
const router = express.Router();
import {loginForm, signupForm, forgotPassword} from '../controllers/userController.js'


router.get('/login', loginForm);
router.get('/signup', signupForm);
router.get('/forgot-password', forgotPassword);


export default router;
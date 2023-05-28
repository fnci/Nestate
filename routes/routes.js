import express from 'express';
const router = express.Router();
import {loginForm, signupForm, register, confirm, forgotPassword, resetPassword, checkToken, newPassword} from '../controllers/userController.js'


router.get('/login', loginForm);

router.get('/signup', signupForm);
router.post('/signup', register);

// Dynamic routing with express
router.get('/confirm/:token', confirm);

router.get('/forgot-password', forgotPassword);
router.post('/forgot-password', resetPassword);

// Store the new password
router.get('/forgot-password/:token', checkToken);
router.post('/forgot-password/:token', newPassword);


export default router;
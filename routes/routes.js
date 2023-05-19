import express from 'express';
const router = express.Router();
import {loginForm, signupForm} from '../controllers/userController.js'


router.get('/login', loginForm);
router.get('/signup', signupForm);


export default router;
import express from 'express';
const router = express.Router();
import {loginForm} from '../controllers/userController.js'


router.get('/login', loginForm)


export default router;
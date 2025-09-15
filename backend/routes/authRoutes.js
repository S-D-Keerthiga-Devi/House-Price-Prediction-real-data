import express from 'express'
import { logout, verifyPhone } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/verify-phone', verifyPhone);
authRouter.post('/logout', logout);

export default authRouter;
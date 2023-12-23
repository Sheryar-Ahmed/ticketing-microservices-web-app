import express from 'express';
import { addUser, loginUser, UpdateUser, logout, currentUser } from '../controller/auth';
import { isAuthenticated } from "@satickserv/common";
const router = express.Router();

router.post('/api/users/register', addUser);
router.post('/api/users/sign', loginUser);
router.post('/api/users/update', UpdateUser);
router.get('/api/users/logout', isAuthenticated,logout);
router.get('/api/users/me', isAuthenticated,currentUser);


export { router as authRouter };


import express from 'express';
import { addUser, loginUser, UpdateUser, logout, currentUser } from '../controller/auth';
const router = express.Router();

router.post('/api/users/register', addUser);
router.post('/api/users/sign', loginUser);
router.post('/api/users/update', UpdateUser);
router.get('/api/users/logout', logout);
router.get('/api/users/me', currentUser);


export { router as authRouter };


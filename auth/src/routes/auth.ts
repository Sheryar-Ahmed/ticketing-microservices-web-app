import express from 'express';
import { addUser, loginUser, UpdateUser, removeUser } from '../controller/auth';
const router = express.Router();

router.get('/api/users/currentuser', addUser);
router.post('/api/users/sign', loginUser);
router.post('/api/users/login', UpdateUser);
router.post('/api/users/remove', removeUser);


export { router as authRouter };


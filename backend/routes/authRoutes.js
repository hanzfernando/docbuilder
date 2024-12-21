import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { getUserDetails } from '../controllers/authController.js';
import { authToken } from '../middleware/auth.js';
const router = express.Router();

// General login route
router.post('/login', loginUser);

router.get('/profile', authToken, getUserDetails);
export default router;

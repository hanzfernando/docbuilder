import express from 'express';
import { createUserAccount, getUsers } from '../controllers/adminController.js';
import { authToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route for admins to create users
router.post('/users', authToken, requireAdmin, createUserAccount);

// Route for admins to get all users
router.get('/users', authToken, requireAdmin, getUsers);

export default router;

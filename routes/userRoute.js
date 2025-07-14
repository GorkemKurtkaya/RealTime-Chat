import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import express from 'express';
const router = express.Router();


// Kullanıcıları listele
router.get('/list', authMiddleware, userController.listUsers);






export default router;
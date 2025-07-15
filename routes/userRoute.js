import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import express from 'express';
const router = express.Router();


// Kullanıcıları listele
router.get('/list', authMiddleware, userController.listUsers);
// Kullanıcı adını ve e-posta adresini güncelle
router.put('/update', authMiddleware, userController.changeNameAndEmail);






export default router;
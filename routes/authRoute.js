import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import express from 'express';

const router = express.Router();


// Kayıt
router.post('/register', authController.register);
// Giriş
router.post('/login', authController.login);
// Token yenileme
router.post('/refresh', authController.refresh);
// Çıkış
router.post('/logout', authMiddleware, authController.logout);
// Profil bilgilerini alma
router.get('/me', authMiddleware, authController.getMyProfile);

export default router;
import * as userController from '../controllers/userController.js';
import { authMiddleware, adminGuard } from '../middleware/authmiddleware.js';
import express from 'express';
const router = express.Router();


// Kullanıcıları listele
router.get('/list', authMiddleware,adminGuard, userController.listUsers);

// Kullanıcı adını ve e-posta adresini güncelle
router.put('/update', authMiddleware, userController.changeNameAndEmail);

// Anlık online kullanıcı sayısını getir
router.get('/online/count', authMiddleware, userController.getOnlineUserCount);

// Online kullanıcıların ID listesini getir (Test Endpoint)
router.get('/online/ids', authMiddleware, userController.getOnlineUserList);

// Belirli bir kullanıcının online olup olmadığını kontrol et
router.get('/online/:userId', authMiddleware, userController.checkUserOnlineStatus);







export default router;
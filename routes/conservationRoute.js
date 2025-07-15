import express from 'express';
const router = express.Router();
import * as conversationController from '../controllers/conservationController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

// Oda oluşturma
router.post('/', authMiddleware, conversationController.createConversation);
// Oda güncelleme
router.put('/:conversationId', authMiddleware, conversationController.updateConversationController);
// Odaya kullanıcı ekle
router.post('/:conversationId/add-user', authMiddleware, conversationController.addUser);
// Odayan kullanıcı çıkar
router.post('/:conversationId/remove-user', authMiddleware, conversationController.removeUser);
// Oda bilgisi getir
router.get('/info/:conversationId', authMiddleware, conversationController.getConversation);
// Oda üyelerini getir
router.get('/:conversationId/users', authMiddleware, conversationController.getUsers);
// Oda adminlerini getir
router.get('/:conversationId/admins', authMiddleware, conversationController.getAdmins);
// Admin ekle
router.post('/:conversationId/add-admin', authMiddleware, conversationController.addAdmin);
// Admin çıkar
router.post('/:conversationId/remove-admin', authMiddleware, conversationController.removeAdmin);
// Kullanıcının konuşmaları
router.get('/:userId', authMiddleware, conversationController.getConversations);

export default router;

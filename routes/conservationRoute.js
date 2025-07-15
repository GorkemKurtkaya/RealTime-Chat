import express from 'express';
const router = express.Router();
import * as conversationController from '../controllers/conservationController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

// Konuşma Oluşturma
router.post('/', authMiddleware, conversationController.createConversation);
// Konuşma Detaylarını Getirme
router.get('/:userId', authMiddleware, conversationController.getConversations);

export default router;

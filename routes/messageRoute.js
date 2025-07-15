import express from 'express';
const router = express.Router();
import * as messageController from '../controllers/messageController.js';
import { authMiddleware,adminGuard } from '../middleware/authmiddleware.js';


// Mesaj gönderme
router.post('/', authMiddleware, messageController.sendMessage);

// Mesajları alma
router.get('/:conversationId', authMiddleware, messageController.getMessages);

export default router;

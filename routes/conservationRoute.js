const express = require('express');
const router = express.Router();
import * as conversationController from '../controllers/conversationController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

router.post('/', conversationController.createConversation);
router.get('/:userId', conversationController.getConversations);

export default router;

import express from 'express';
const router = express.Router();
import * as messageController from '../controllers/messageController.js';

router.post('/', messageController.sendMessage);
router.get('/:conversationId', messageController.getMessages);

export default router;

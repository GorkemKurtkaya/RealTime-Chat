import {
    sendToMessage,
    getMessage
} from '../services/messageService.js';
import Conversation from '../models/conversationModel.js'; // Conversation modelini ekle

// Mesaj Gönderme
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;
    const message = await sendToMessage(conversationId, sender, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mesajları Getirme
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId; // authMiddleware'den geliyor olmalı

    // 1. Conversation'ı bul
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Konuşma bulunamadı.' });
    }

    // 2. Katılımcı mı kontrol et
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Bu konuşmanın mesajlarını görmeye yetkiniz yok.' });
    }

    // 3. Mesajları getir
    const messages = await getMessage(conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



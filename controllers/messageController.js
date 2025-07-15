import {
    sendToMessage,
    getMessage
} from '../services/messageService.js';
import Conversation from '../models/conversationModel.js'; 
import defaultLogger from '../utils/logger.js';
import User from '../models/userModel.js'; 

// Mesaj Gönderme
export const sendMessage = async (req, res) => {
  const { conversationId, sender, content } = req.body;

  defaultLogger.info('sendMessage fonksiyonu çağrıldı', { conversationId, sender });

  try {
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      defaultLogger.warn('Mesaj gönderilmeye çalışılan konuşma bulunamadı', { conversationId, sender });
      return res.status(404).json({ message: 'Konuşma bulunamadı.' });
    }

    
    if (!conversation.participants.includes(sender)) {
      defaultLogger.warn('Kullanıcı, katılımcısı olmadığı konuşmaya mesaj göndermeye çalıştı', { conversationId, sender });
      return res.status(403).json({ message: 'Bu konuşmaya mesaj göndermeye yetkiniz yok.' });
    }

    
    const user = await User.findById(sender);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
   
    const message = await sendToMessage(conversationId, sender, content);

    defaultLogger.info('Mesaj gönderildi', { conversationId, sender });
    res.status(201).json(message);
  } catch (err) {
    defaultLogger.error('Mesaj gönderme sırasında hata oluştu', { error: err.message, conversationId, sender });
    res.status(500).json({ message: err.message });
  }
};

// Mesajları Getirme
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.userId;
  defaultLogger.info('getMessages fonksiyonu çağrıldı', { conversationId, userId });
  try {
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      defaultLogger.warn('Konuşma bulunamadı', { conversationId, userId });
      return res.status(404).json({ message: 'Konuşma bulunamadı.' });
    }

    
    if (!conversation.participants.includes(userId)) {
      defaultLogger.warn('Yetkisiz mesaj görüntüleme girişimi', { conversationId, userId });
      return res.status(403).json({ message: 'Bu konuşmanın mesajlarını görmeye yetkiniz yok.' });
    }

    
    const messages = await getMessage(conversationId);
    defaultLogger.info('Mesajlar getirildi', { conversationId, userId });
    res.status(200).json(messages);
  } catch (err) {
    defaultLogger.error('Mesajlar getirilirken hata oluştu', { error: err.message, conversationId, userId });
    res.status(500).json({ message: err.message });
  }
};



import {
    createConversations,
    getUserConversations
} from "../services/conservationService.js";
import defaultLogger from "../utils/logger.js";

//Konuşma Oluşturma 
export const createConversation = async (req, res) => {
  defaultLogger.info('createConversation fonksiyonu çağrıldı', { userId: req.userId, userIds: Array.isArray(req.body?.userIds) ? req.body.userIds.length : undefined });
  try {
    const { userIds } = req.body;
    const loggedInUserId = req.userId;

    if (!userIds.includes(loggedInUserId)) {
      defaultLogger.warn('Kullanıcı kendi dahil olmadığı konuşmayı başlatmaya çalıştı', { userId: loggedInUserId });
      return res.status(403).json({ message: 'Kendi dahil olmadığın bir konuşma başlatamazsın.' });
    }

    const conversation = await createConversations(userIds);
    defaultLogger.info('Konuşma oluşturuldu', { userId: loggedInUserId, conversationId: conversation?._id });
    res.status(201).json(conversation);
  } catch (err) {
    defaultLogger.error('Konuşma oluşturulurken hata oluştu', { error: err.message, userId: req.userId });
    res.status(500).json({ message: err.message });
  }
};

// Konuşmaları Getirme
export const getConversations = async (req, res) => {
  defaultLogger.info('getConversations fonksiyonu çağrıldı', { userId: req.userId, paramUserId: req.params.userId });
  try {
    const { userId } = req.params;
    const loggedInUserId = req.userId; 

    if (userId !== loggedInUserId) {
      defaultLogger.warn('Kullanıcı başka birinin konuşmalarını görüntülemeye çalıştı', { userId: loggedInUserId, paramUserId: userId });
      return res.status(403).json({ message: 'Başka bir kullanıcının konuşmalarını göremezsiniz.' });
    }

    const conversations = await getUserConversations(userId);
    defaultLogger.info('Kullanıcının konuşmaları getirildi', { userId });
    res.status(200).json(conversations);
  } catch (err) {
    defaultLogger.error('Konuşmalar getirilirken hata oluştu', { error: err.message, userId: req.userId });
    res.status(500).json({ message: err.message });
  }
};



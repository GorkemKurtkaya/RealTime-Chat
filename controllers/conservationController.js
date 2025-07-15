import {
    createConversation as createConversationService,
    updateConversation,
    addUserToConversation,
    removeUserFromConversation,
    getConversationById,
    getConversationUsers,
    getConversationAdmins,
    addAdminToConversation,
    removeAdminFromConversation,
    getUserConversations
} from "../services/conservationService.js";
import defaultLogger from "../utils/logger.js";

// Oda oluşturma
export const createConversation = async (req, res) => {
  try {
    const { name, description, userIds, adminIds } = req.body;
    const loggedInUserId = req.userId;
    if (!userIds.includes(loggedInUserId)) {
      return res.status(403).json({ message: 'Kendi dahil olmadığın bir oda başlatamazsın.' });
    }
    if (!adminIds.includes(loggedInUserId)) {
      return res.status(403).json({ message: 'Kendi dahil olmadığın bir odaya admin olamazsın.' });
    }
    const conversation = await createConversationService({ name, description, userIds, adminIds });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Oda güncelleme
export const updateConversationController = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const updates = req.body;
    const conversation = await getConversationById(conversationId);
    const adminIds = conversation.admins.map(a => (a._id ? a._id.toString() : a.toString()));
    if (!adminIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece adminler odayı güncelleyebilir.' });
    }
    const updated = await updateConversation(conversationId, updates);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Odaya kullanıcı ekle
export const addUser = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await getConversationById(conversationId);
    const adminIds = conversation.admins.map(a => (a._id ? a._id.toString() : a.toString()));
    if (!adminIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece adminler kullanıcı ekleyebilir.' });
    }
    const updated = await addUserToConversation(conversationId, userId);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Odayan kullanıcı çıkar
export const removeUser = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await getConversationById(conversationId);
    const adminIds = conversation.admins.map(a => (a._id ? a._id.toString() : a.toString()));
    if (!adminIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece adminler kullanıcı çıkarabilir.' });
    }
    const updated = await removeUserFromConversation(conversationId, userId);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Oda bilgisi getir
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await getConversationById(conversationId);
    // Sadece oda katılımcısı erişebilsin
    const participantIds = conversation.participants.map(p => (p._id ? p._id.toString() : p.toString()));
    if (!participantIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece oda katılımcıları bu bilgiyi görebilir.' });
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Oda üyelerini getir
export const getUsers = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await getConversationById(conversationId);
    const participantIds = conversation.participants.map(p => (p._id ? p._id.toString() : p.toString()));
    if (!participantIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece oda katılımcıları üyeleri görebilir.' });
    }
    const users = await getConversationUsers(conversationId);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Oda adminlerini getir
export const getAdmins = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await getConversationById(conversationId);
    const participantIds = conversation.participants.map(p => (p._id ? p._id.toString() : p.toString()));
    if (!participantIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece oda katılımcıları adminleri görebilir.' });
    }
    const admins = await getConversationAdmins(conversationId);
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin ekle
export const addAdmin = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await getConversationById(conversationId);
    const adminIds = conversation.admins.map(a => (a._id ? a._id.toString() : a.toString()));
    if (!adminIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece adminler admin ekleyebilir.' });
    }
    const updated = await addAdminToConversation(conversationId, userId);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin çıkar
export const removeAdmin = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await getConversationById(conversationId);
    const adminIds = conversation.admins.map(a => (a._id ? a._id.toString() : a.toString()));
    if (!adminIds.includes(req.userId)) {
      return res.status(403).json({ message: 'Sadece adminler admin çıkarabilir.' });
    }
    const updated = await removeAdminFromConversation(conversationId, userId);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Kullanıcının konuşmaları (mevcut fonksiyon)
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.userId; 
    if (userId !== loggedInUserId) {
      return res.status(403).json({ message: 'Başka bir kullanıcının konuşmalarını göremezsiniz.' });
    }
    const conversations = await getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



import Conversation from '../models/conversationModel.js';

// Oda oluşturma
export const createConversation = async ({ name, description, userIds, adminIds }) => {
  const existing = await Conversation.findOne({
    name,
    participants: { $all: userIds, $size: userIds.length }
  });
  if (existing) return existing;
  const newConv = new Conversation({
    name,
    description,
    participants: userIds,
    admins: adminIds
  });
  return await newConv.save();
};

// Oda güncelleme (isim, açıklama)
export const updateConversation = async (conversationId, updates) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { $set: updates },
    { new: true }
  );
};

// Odaya kullanıcı ekle
export const addUserToConversation = async (conversationId, userId) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { $addToSet: { participants: userId } },
    { new: true }
  );
};

// Odayan kullanıcı çıkar
export const removeUserFromConversation = async (conversationId, userId) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { $pull: { participants: userId, admins: userId } },
    { new: true }
  );
};

// Oda bilgisi getir
export const getConversationById = async (conversationId) => {
  return await Conversation.findById(conversationId)
    .populate('participants', 'username email')
    .populate('admins', 'username email');
};

// Oda üyelerini getir
export const getConversationUsers = async (conversationId) => {
  const conv = await Conversation.findById(conversationId).populate('participants', 'username email');
  return conv ? conv.participants : [];
};

// Oda adminlerini getir
export const getConversationAdmins = async (conversationId) => {
  const conv = await Conversation.findById(conversationId).populate('admins', 'username email');
  return conv ? conv.admins : [];
};

// Kullanıcıyı admin yap
export const addAdminToConversation = async (conversationId, userId) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { $addToSet: { admins: userId } },
    { new: true }
  );
};

// Adminlikten çıkar
export const removeAdminFromConversation = async (conversationId, userId) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { $pull: { admins: userId } },
    { new: true }
  );
};

// Kullanıcının konuşmaları
export const getUserConversations = async (userId) => {
  return await Conversation.find({
    participants: userId
  }).populate('participants', 'username email');
};


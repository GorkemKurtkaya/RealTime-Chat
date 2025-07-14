import Conversation from '../models/conservationModel.js';

export const createConversations = async (userIds) => {
  const existing = await Conversation.findOne({
    participants: { $all: userIds, $size: userIds.length }
  });

  if (existing) return existing;

  const newConv = new Conversation({ participants: userIds });
  return await newConv.save();
};

export const getUserConversations = async (userId) => {
  return await Conversation.find({
    participants: userId
  }).populate('participants', 'username email');
};


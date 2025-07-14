import Message from '../models/messageModel.js';

export const sendToMessage = async (conversationId, sender, content) => {
  const newMessage = new Message({ conversationId, sender, content });
  return await newMessage.save();
};

export const getMessage = async (conversationId) => {
  return await Message.find({ conversationId })
    .populate('sender', 'username');
};



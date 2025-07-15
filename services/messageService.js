import Message from '../models/messageModel.js';

export const sendToMessage = async (conversationId, sender, content) => {
  const newMessage = new Message({ conversationId, sender, content, readBy: [sender] }); 
  return await newMessage.save();
};

export const getMessage = async (conversationId) => {
  return await Message.find({ conversationId })
    .populate('sender', 'username');
};

// Tüm okunmamış mesajları okundu yap
export async function markAllMessagesAsRead(roomId, userId) {
  await Message.updateMany(
    { roomId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );
}

// Yeni mesajı güncelle: readBy'ya kullanıcı ekle
export async function addUserToMessageReadBy(messageId, userId) {
  await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { readBy: userId } }
  );
}



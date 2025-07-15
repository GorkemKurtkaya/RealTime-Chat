import User from "../models/userModel.js";
import AutoMessage from "../models/autoMessageModel.js";
import rabbitMQ from "../utils/rabbitmq.js";
import Message from "../models/messageModel.js";
import { getIO } from "../utils/socket.js";
import Conversation from "../models/conversationModel.js"; 


const randomMessages = [
  "Günaydın! Nasılsın?",
  "Bugün harika bir gün olacak!",
  "Birlikte kahve içelim mi?",
  "Haftasonu planların neler?",
  "Sana güzel bir haberim var!"
];

// RabbitMQ kuyruk adı
const AUTO_MESSAGE_QUEUE = "auto_messages";

// 1. Yeni Mesaj Planlama
export const scheduleAutoMessages = async () => {
  const users = await User.find({ isActive: true });
  if (users.length < 2) return;

  const shuffled = shuffleArray(users);
  
  const batch = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const sender = shuffled[i]._id;
    const receiver = shuffled[i + 1]._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver], $size: 2 }
    });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [sender, receiver] });
    }

    batch.push({
      sender,
      receiver,
      conversationId: conversation._id,
      content: getRandomMessage(),
      sendDate: new Date(Date.now() + 1 * 60 * 1000) // Mesajın Gönderimini 1 dakika sonraya planladım burdan arttırılabilir.
    });
  }

  await AutoMessage.insertMany(batch);
};

// 2. Kuyruğa Eklenecek Mesajları İşle
export const processPendingMessages = async () => {
  const pendingMessages = await AutoMessage.find({
    sendDate: { $lte: new Date() },
    isQueued: false,
    isSent: false
  });

  console.log(`[AutoMessage] İşlenecek mesaj sayısı: ${pendingMessages.length}`);

  for (const msg of pendingMessages) {
    try {
      console.log(`[AutoMessage] Kuyruğa gönderiliyor: ID=${msg._id}, receiver=${msg.receiver}, content="${msg.content}"`);
      await rabbitMQ.sendToQueue(AUTO_MESSAGE_QUEUE, {
        autoMessageId: msg._id.toString(),
        senderId: msg.sender,
        receiverId: msg.receiver,
        conversationId: msg.conversationId, 
        content: msg.content
      });

      await AutoMessage.findByIdAndUpdate(msg._id, { isQueued: true });
      console.log(`[AutoMessage] Mesaj kuyruğa alındı: ID=${msg._id}`);
    } catch (err) {
      console.error(`[AutoMessage] Mesaj kuyruğa eklenemedi (ID: ${msg._id}):`, err);
    }
  }
};

// 3. RabbitMQ Consumer için Mesaj Gönderim
export const sendAutoMessage = async (messageData) => {
  const { autoMessageId, senderId, receiverId, content, conversationId } = messageData;

  const sentMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    conversationId, 
    content,
    isAuto: true
  });

  await AutoMessage.findByIdAndUpdate(autoMessageId, { isSent: true });

  const io = getIO();
  if (io) {
    io.to(conversationId.toString()).emit('message_received', sentMessage);
  }

  return sentMessage;
};


function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomMessage() {
  return randomMessages[Math.floor(Math.random() * randomMessages.length)];
}
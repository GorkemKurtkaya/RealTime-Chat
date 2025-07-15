import User from "../models/userModel.js";
import AutoMessage from "../models/autoMessageModel.js";
import rabbitMQ from "../utils/rabbitmq.js";
import Message from "../models/messageModel.js";
import { getIO } from "../utils/socket.js";
import Conversation from "../models/conversationModel.js";
import redisClient from '../utils/redis.js';
import defaultLogger from '../utils/logger.js';


const randomMessages = [
  "Günaydın! Nasılsın?",
  "Bugün harika bir gün olacak!",
  "Birlikte kahve içelim mi?",
  "Haftasonu planların neler?",
  "Sana güzel bir haberim var!"
];

const AUTO_MESSAGE_QUEUE = "auto_messages";

// 1. Yeni Mesaj Planlama
export const scheduleAutoMessages = async () => {
  const onlineUserIds = await redisClient.sMembers('online_users');

  const users = await User.find({ _id: { $in: onlineUserIds } });

  if (users.length < 2) {
    defaultLogger.info('AutoMessage: Yeterli user yok, çıkılıyor.');
    return;
  }

  const shuffled = shuffleArray(users);
  const batch = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const sender = shuffled[i]._id;
    const receiver = shuffled[i + 1]._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver], $size: 2 }
    });
    if (!conversation) {
      try {
        conversation = await Conversation.create({
          name: `Otomatik Oda`,
          description: 'Otomatik mesaj için oluşturuldu.',
          participants: [sender, receiver],
          admins: [sender, receiver]
        });
        defaultLogger.info('AutoMessage: Yeni oda oluşturuldu.');
      } catch (err) {
        defaultLogger.error('AutoMessage: Oda oluşturulamadı.', { error: err.message });
      }
    } else {
      defaultLogger.info('AutoMessage: Mevcut oda bulundu.');
    }

    if (conversation) {
      batch.push({
        sender,
        receiver,
        conversationId: conversation._id,
        content: getRandomMessage(),
        sendDate: new Date(Date.now() + 1 * 60 * 1000)
      });
    }
  }

  defaultLogger.info(`AutoMessage: ${batch.length} adet otomatik mesaj oluşturulacak.`);
  if (batch.length > 0) {
    await AutoMessage.insertMany(batch);
    defaultLogger.info('AutoMessage: AutoMessage insert edildi.');
  } else {
    defaultLogger.info('AutoMessage: Batch boş, insert yapılmadı.');
  }
};

// 2. Kuyruğa Eklenecek Mesajları İşle
export const processPendingMessages = async () => {
  const pendingMessages = await AutoMessage.find({
    sendDate: { $lte: new Date() },
    isQueued: false,
    isSent: false
  });

  defaultLogger.info(`[AutoMessage] İşlenecek mesaj sayısı: ${pendingMessages.length}`);

  for (const msg of pendingMessages) {
    try {
      defaultLogger.info(`[AutoMessage] Kuyruğa gönderiliyor: ID=${msg._id}`);
      await rabbitMQ.sendToQueue(AUTO_MESSAGE_QUEUE, {
        autoMessageId: msg._id.toString(),
        senderId: msg.sender,
        receiverId: msg.receiver,
        conversationId: msg.conversationId, 
        content: msg.content
      });

      await AutoMessage.findByIdAndUpdate(msg._id, { isQueued: true });
      defaultLogger.info(`[AutoMessage] Mesaj kuyruğa alındı: ID=${msg._id}`);
    } catch (err) {
      defaultLogger.error(`[AutoMessage] Mesaj kuyruğa eklenemedi (ID: ${msg._id})`, { error: err.message });
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
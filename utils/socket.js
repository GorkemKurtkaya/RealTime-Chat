import { Server } from 'socket.io';
import socketAuthMiddleware from '../utils/socketAuthMiddleware.js';
import { sendToMessage } from '../services/messageService.js';
import { getUserConversations } from '../services/conservationService.js';
import User from '../models/userModel.js';
import sanitizeHtml from 'sanitize-html';

const onlineUsers = new Map();

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(socketAuthMiddleware);
  const messageTimestamps = new Map();

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, { socketId: socket.id, isActive: true });
    await User.findByIdAndUpdate(userId, { isActive: true });
    console.log(`🔌 ${userId} connected`);

    socket.broadcast.emit('user_online', { userId });

    socket.on('join_room', async (roomId) => {
      const conversations = await getUserConversations(userId);
      const isMember = conversations.some(conv => conv._id.toString() === roomId.toString());
      if (!isMember) {
        socket.emit('error', { message: 'Bu odaya katılma yetkiniz yok.' });
        return;
      }
      socket.join(roomId);
      console.log(`👥 ${userId} joined room ${roomId}`);
      const clients = await io.in(roomId).allSockets();
      const onlineInRoom = Array.from(clients).map(socketId => {
        for (const [uid, info] of onlineUsers.entries()) {
          if (info.socketId === socketId && info.isActive) return uid;
        }
        return null;
      }).filter(Boolean);
      socket.emit('online_users', { roomId, users: onlineInRoom });
    });



    socket.on('send_message', async (data) => {
      const { roomId, message, content } = data;
      if (!roomId) {
        socket.emit('error', { message: 'roomId zorunludur!' });
        return;
      }
      const msgContent = content || message;
      if (typeof msgContent !== 'string' || msgContent.length === 0 || msgContent.length > 500) {
        socket.emit('error', { message: 'Mesaj metni zorunlu ve 500 karakterden kısa olmalı!' });
        return;
      }
      const now = Date.now();
      const last = messageTimestamps.get(userId) || 0;
      if (now - last < 1000) {
        socket.emit('error', { message: 'Çok hızlı mesaj atıyorsun!' });
        return;
      }
      messageTimestamps.set(userId, now);
      const safeMsgContent = sanitizeHtml(msgContent, { allowedTags: [], allowedAttributes: {} });
      const conversations = await getUserConversations(userId);
      const isMember = conversations.some(conv => conv._id.toString() === roomId.toString());
      if (!isMember) {
        socket.emit('error', { message: 'Bu odaya mesaj gönderme yetkiniz yok.' });
        return;
      }
      try {
        await sendToMessage(roomId, userId, safeMsgContent);
      } catch (err) {
        console.error('Mesaj veritabanına kaydedilemedi:', err);
      }
      io.to(roomId).emit('message_received', {
        message: safeMsgContent,
        senderId: userId,
        timestamp: new Date()
      });
      io.to(roomId).emit('notification', {
        type: 'new_message',
        message: 'Yeni mesajınız var!',
        roomId,
        senderId: userId
      });
      console.log(`📨 ${userId} → ${roomId}: ${safeMsgContent}`);
    });


    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('typing', { userId });
    });


    socket.on('stop_typing', (roomId) => {
      socket.to(roomId).emit('stop_typing', { userId });
    });


    socket.on('message_read', async ({ roomId, messageId }) => {
      socket.to(roomId).emit('message_read', { messageId, userId });
    });


    socket.on('leave_room', async (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_offline', { userId });
      console.log(`🚪 ${userId} left room ${roomId}`);
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      if (rooms.length === 0) {
        onlineUsers.set(userId, { socketId: socket.id, isActive: false });
        await User.findByIdAndUpdate(userId, { isActive: false });
        socket.broadcast.emit('user_offline', { userId });
        console.log(`❌ ${userId} is now fully offline (left all rooms)`);
      }
    });

    
    socket.on('disconnect', async () => {
      onlineUsers.set(userId, { socketId: socket.id, isActive: false });
      await User.findByIdAndUpdate(userId, { isActive: false });
      socket.broadcast.emit('user_offline', { userId });
      console.log(`❌ ${userId} disconnected`);
    });
  });
};

export default socketHandler;

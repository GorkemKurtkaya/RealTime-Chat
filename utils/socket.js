import { Server } from 'socket.io';
import socketAuthMiddleware from '../utils/socketAuthMiddleware.js';
import { sendToMessage } from '../services/messageService.js';

const onlineUsers = new Map();

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // io.use(socketAuthMiddleware); // JWT doğrulaması kaldırıldı

  io.on('connection', (socket) => {
    // Kullanıcıyı socket handshake üzerinden alıyoruz (örnek: username parametresi ile)
    const userId = socket.handshake.query.userId || socket.id;
    onlineUsers.set(userId, { socketId: socket.id, isActive: true });
    console.log(`🔌 ${userId} connected`);

    socket.broadcast.emit('user_online', { userId });

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`👥 ${userId} joined room ${roomId}`);
    });

    socket.on('send_message', async (data) => {
      const { roomId, message, receiverId } = data;
      // Mesajı önce veritabanına kaydet
      try {
        await sendToMessage(roomId, userId, message);
      } catch (err) {
        console.error('Mesaj veritabanına kaydedilemedi:', err);
      }
      // Sonra odaya ilet
      io.to(roomId).emit('message_received', {
        message,
        senderId: userId,
        timestamp: new Date()
      });
      console.log(`📨 ${userId} → ${roomId}: ${message}`);
    });

    socket.on('disconnect', () => {
      onlineUsers.set(userId, { socketId: socket.id, isActive: false });
      socket.broadcast.emit('user_offline', { userId });
      console.log(`❌ ${userId} disconnected`);
    });
  });
};

export default socketHandler;

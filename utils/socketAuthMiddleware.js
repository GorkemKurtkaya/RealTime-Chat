import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.handshake.query?.['auth.token'];

    console.log('Gelen token:', token);

    if (!token) {
      return next(new Error('Token bulunamadı'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    

    const user = await User.findById(decoded.id);
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined,
    };
    console.log('User:',  userWithoutPassword);

    if (!user) {
      return next(new Error('Geçersiz kullanıcı'));
    }

    socket.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Socket auth error:', error);
    next(new Error('Socket kimlik doğrulama hatası'));
  }
};

export default socketAuthMiddleware;

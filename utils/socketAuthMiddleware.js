import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Token bulunamadı'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

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
    next(new Error('Socket kimlik doğrulama hatası'));
  }
};

export default socketAuthMiddleware;

import rateLimit from 'express-rate-limit';

// Auth işlemleri için limit
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 7, // 5-10 arası uygundur, burada 7 seçtik
  message: 'Çok fazla giriş/kayıt denemesi yaptınız. Lütfen 5 dakika sonra tekrar deneyin.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Mesaj işlemleri için limit
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 40, 
  message: 'Çok fazla mesaj işlemi yaptınız. Lütfen biraz bekleyin.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Conversation işlemleri için limit
export const conversationLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20, 
  message: 'Çok fazla konuşma işlemi yaptınız. Lütfen biraz bekleyin.',
  standardHeaders: true,
  legacyHeaders: false,
});

// User işlemleri için limit
export const userLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 50, 
  message: 'Çok fazla kullanıcı işlemi yaptınız. Lütfen biraz bekleyin.',
  standardHeaders: true,
  legacyHeaders: false,
});

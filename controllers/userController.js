import * as userService from '../services/userService.js';
import defaultLogger from '../utils/logger.js';


// Kullanıcıları listele
export const listUsers = async (req, res) => {
  defaultLogger.info('listUsers fonksiyonu çağrıldı');
  try {
    const users = await userService.getAllUsers();
    defaultLogger.info('Kullanıcılar listelendi');
    res.status(200).json(users);
  } catch (error) {
    defaultLogger.error('Kullanıcılar listelenirken hata oluştu', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı adını ve e-posta adresini güncelle
export const changeNameAndEmail = async (req, res) => {
  const userId = req.cookies.userId;
  defaultLogger.info('changeNameAndEmail fonksiyonu çağrıldı', { userId });
  const { newName, newMail } = req.body;

  if (!userId) {
    defaultLogger.warn('Kullanıcı kimliği bulunamadı', { userId });
    return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı." });
  }

  try {
    const result = await userService.changeNameandMailService(userId, newName, newMail);
    defaultLogger.info('Kullanıcı adı ve e-posta güncellendi', { userId });
    res.status(200).json({ message: result });
  } catch (error) {
    defaultLogger.error('Kullanıcı adı ve e-posta güncellenirken hata oluştu', { error: error.message, userId });
    res.status(500).json({ error: error.message });
  }
};


// Anlık online kullanıcı sayısını getir
export const getOnlineUserCount = async (req, res) => {
  defaultLogger.info('getOnlineUserCount fonksiyonu çağrıldı');
  try {
    const count = await userService.getOnlineUserCount();
    defaultLogger.info('Online kullanıcı sayısı getirildi');
    res.status(200).json({ onlineUserCount: count });
  } catch (error) {
    defaultLogger.error('Online kullanıcı sayısı getirilirken hata oluştu', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir kullanıcının online olup olmadığını kontrol et
export const checkUserOnlineStatus = async (req, res) => {
  const { userId } = req.params;
  defaultLogger.info('checkUserOnlineStatus fonksiyonu çağrıldı', { userId });

  if (!userId) {
    defaultLogger.warn('Kullanıcı kimliği gerekli', { userId });
    return res.status(400).json({ error: "Kullanıcı kimliği gerekli." });
  }

  try {
    const isOnline = await userService.isUserOnline(userId);
    defaultLogger.info('Kullanıcının online durumu kontrol edildi', { userId });
    res.status(200).json({ userId, isOnline });
  } catch (error) {
    defaultLogger.error('Kullanıcının online durumu kontrol edilirken hata oluştu', { error: error.message, userId });
    res.status(500).json({ error: error.message });
  }
};


// Online kullanıcıların listesini getir
export const getOnlineUserList = async (req, res) => {
  defaultLogger.info('getOnlineUserList fonksiyonu çağrıldı');
  try {
    const onlineUsers = await userService.getOnlineUserList();
    defaultLogger.info('Online kullanıcı listesi getirildi');
    res.status(200).json({ onlineUsers });
  } catch (error) {
    defaultLogger.error('Online kullanıcı listesi getirilirken hata oluştu', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
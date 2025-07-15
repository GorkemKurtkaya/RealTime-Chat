import * as userService from '../services/userService.js';


// Kullanıcıları listele
export const listUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı adını ve e-posta adresini güncelle
export const changeNameAndEmail = async (req, res) => {
  const userId = req.cookies.userId;
  const { newName, newMail } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı." });
  }

  try {
    const result = await userService.changeNameandMailService(userId, newName, newMail);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Anlık online kullanıcı sayısını getir
export const getOnlineUserCount = async (req, res) => {
  try {
    const count = await userService.getOnlineUserCount();
    res.status(200).json({ onlineUserCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir kullanıcının online olup olmadığını kontrol et
export const checkUserOnlineStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Kullanıcı kimliği gerekli." });
  }

  try {
    const isOnline = await userService.isUserOnline(userId);
    res.status(200).json({ userId, isOnline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Online kullanıcıların listesini getir
export const getOnlineUserList = async (req, res) => {
  try {
    const onlineUsers = await userService.getOnlineUserList();
    res.status(200).json({ onlineUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
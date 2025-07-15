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
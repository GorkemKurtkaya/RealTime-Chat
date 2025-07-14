import { getAllUsers } from "../services/userService.js";


// Kullanıcıları listele
export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
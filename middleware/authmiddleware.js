import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Token kontrolü için middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ error: "Geçersiz oturum" });
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(401).json({ error: "Kimlik doğrulama hatası" });
  }
};

export { authMiddleware };

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async ({ name, email, password }) => {

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Bu email ile kayıtlı bir kullanıcı zaten var.");
  }

  const user = new User({ name, email, password });
  await user.save();

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Şifre hatalı.");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return { user, token };
};

export const refreshToken = async (oldToken) => {
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true });
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Kullanıcı bulunamadı.");


    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { user, token: newToken };
  } catch (error) {
    throw new Error("Token yenileme başarısız.");
  }
};

export const logoutUser = async () => {
  return true;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password -__v");
  if (!user) {
    throw new Error("Kullanıcı bulunamadı.");
  }
  return user;
}

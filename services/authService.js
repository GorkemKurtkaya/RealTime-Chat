import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Bu email ile kayıtlı bir kullanıcı zaten var.");
  }

  const user = new User({ name, email, password, role: role || "user" });
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
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { user, token, refreshToken };
};

export const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Kullanıcı bulunamadı.");

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { user, token: newAccessToken };
  } catch (error) {
    throw new Error("Refresh token geçersiz veya süresi dolmuş.");
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

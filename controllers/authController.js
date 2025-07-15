import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getProfile

} from "../services/authService.js";
import defaultLogger from "../utils/logger.js";

// Kayıt
export const register = async (req, res) => {
  const { password, ...bodyWithoutPassword } = req.body || {};
  defaultLogger.info('register fonksiyonu çağrıldı', { body: bodyWithoutPassword });
  try {
    const user = await registerUser(req.body);
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined,
    };

    res.status(201).json({ message: "Kayıt başarılı", user: userWithoutPassword });
  } catch (error) {
    defaultLogger.error('Kayıt sırasında hata oluştu', { error, body: bodyWithoutPassword });
    res.status(400).json({ error: error.message });
    console.log("Gelen Body:", req.body);
  }
};

// Giriş
export const login = async (req, res) => {
  const { password, ...bodyWithoutPassword } = req.body || {};
  defaultLogger.info('login fonksiyonu çağrıldı', { body: bodyWithoutPassword });
  try {
    const { user, token, refreshToken } = await loginUser(req.body);
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined,
    };

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
    res.cookie("userId", user._id.toString(), { httpOnly: true, sameSite: "strict" });
    defaultLogger.info('Kullanıcı giriş yaptı', { userId: user._id });
    res.status(200).json({ message: "Giriş başarılı", user: userWithoutPassword, token, refreshToken });
  } catch (error) {
    defaultLogger.error('Giriş sırasında hata oluştu', { error, body: bodyWithoutPassword });
    res.status(400).json({ error: error.message });
  }
};

// Token yenileme
export const refresh = async (req, res) => {
  defaultLogger.info('refresh fonksiyonu çağrıldı', { cookies: req.cookies });
  try {
    const refreshTokenValue = req.cookies.refreshToken;
    if (!refreshTokenValue) {
      defaultLogger.warn('Refresh token bulunamadı', { cookies: req.cookies });
      return res.status(401).json({ error: "Refresh token bulunamadı." });
    }
    const { user, token } = await refreshToken(refreshTokenValue);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    defaultLogger.info('Token yenilendi', { userId: user._id });
    res.status(200).json({ message: "Token yenilendi", token });
  } catch (error) {
    defaultLogger.error('Token yenileme sırasında hata oluştu', { error, cookies: req.cookies });
    res.status(401).json({ error: error.message });
  }
};

// Çıkış
export const logout = async (req, res) => {
  defaultLogger.info('logout fonksiyonu çağrıldı', { cookies: req.cookies });
  try {
    await logoutUser();
    res.clearCookie("token");
    res.clearCookie("userId");
    res.clearCookie("refreshToken");
    defaultLogger.info('Kullanıcı çıkış yaptı');
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    defaultLogger.error('Çıkış sırasında hata oluştu', { error, cookies: req.cookies });
    res.status(400).json({ error: error.message });
  }
};

// Profil bilgilerini alma
export const getMyProfile = async (req, res) => {
  defaultLogger.info('getMyProfile fonksiyonu çağrıldı', { userId: req.userId });
  try {
    const userId = req.userId; 
    const user = await getProfile(userId);
    defaultLogger.info('Profil bilgisi getirildi', { userId });
    res.status(200).json(user);
  } catch (error) {
    defaultLogger.error('Profil bilgisi getirilirken hata oluştu', { error, userId: req.userId });
    res.status(400).json({ error: error.message });
  }
};

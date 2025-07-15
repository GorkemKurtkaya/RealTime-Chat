import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getProfile

} from "../services/authService.js";

// Kayıt
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined,
    };

    res.status(201).json({ message: "Kayıt başarılı", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Gelen Body:", req.body);
  }
};

// Giriş
export const login = async (req, res) => {
  try {
    const { user, token, refreshToken } = await loginUser(req.body);
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined,
    };

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
    res.cookie("userId", user._id.toString(), { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Giriş başarılı", user: userWithoutPassword, token, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Token yenileme
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token bulunamadı." });
    }
    const { user, token } = await refreshToken(refreshToken);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Token yenilendi", token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Çıkış
export const logout = async (req, res) => {
  try {
    await logoutUser();
    res.clearCookie("token");
    res.clearCookie("userId");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Profil bilgilerini alma
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId; 
    const user = await getProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

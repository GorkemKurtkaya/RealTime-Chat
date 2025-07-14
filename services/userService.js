import User from "../models/userModel.js";


export const getAllUsers = async () => {
    try {
        const users = await User.find().select("-password -__v");
        return users;
    } catch (error) {
        throw new Error("Kullanıcılar alınamadı: " + error.message);
    }
    }
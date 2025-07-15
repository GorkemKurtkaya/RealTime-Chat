import User from "../models/userModel.js";
import redisClient from '../utils/redis.js';


export const getAllUsers = async () => {
    try {
        const users = await User.find().select("-password -__v");
        return users;
    } catch (error) {
        throw new Error("Kullanıcılar alınamadı: " + error.message);
    }
    }


export const changeNameandMailService = async (userId, newName, newMail) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.name = newName || user.name;
    user.email = newMail || user.email;
    await user.save();

    return "Name and/or email changed successfully";
};

// Anlık online kullanıcı sayısı
export const getOnlineUserCount = async () => {
    return await redisClient.sCard('online_users');
};

// Belirli bir kullanıcının online olup olmadığını kontrol et
export const isUserOnline = async (userId) => {
    return (await redisClient.sIsMember('online_users', userId)) === 1;
};

// Online kullanıcıların ID listesini getir
export const getOnlineUserList = async () => {
    return await redisClient.sMembers('online_users');
};
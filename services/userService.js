import User from "../models/userModel.js";


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
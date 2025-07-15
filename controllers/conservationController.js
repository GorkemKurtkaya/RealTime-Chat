import {
    createConversations,
    getUserConversations
} from "../services/conservationService.js";

//Konuşma Oluşturma 
export const createConversation = async (req, res) => {
  try {
    const { userIds } = req.body;
    const conversation = await createConversations(userIds);
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Konuşmaları Getirme
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



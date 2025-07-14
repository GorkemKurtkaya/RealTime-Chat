import {
    sendToMessage,
    getMessage
} from '../services/messageService.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;
    const message = await sendToMessage(conversationId, sender, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await getMessage(conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



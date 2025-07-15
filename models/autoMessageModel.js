import mongoose from "mongoose";

const autoMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  content: { type: String, required: true },
  sendDate: { type: Date, required: true },
  isQueued: { type: Boolean, default: false }, 
  isSent: { type: Boolean, default: false },   
  queueId: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

const AutoMessage = mongoose.model("AutoMessage", autoMessageSchema);

export default AutoMessage;
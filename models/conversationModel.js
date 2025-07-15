import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description: { type: String }, 
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ConversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;

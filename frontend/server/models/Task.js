const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  progress: { type: Number },
  timeLeft: { type: String },
  image: { type: String },
  teamMembers: [{ type: String }],
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);

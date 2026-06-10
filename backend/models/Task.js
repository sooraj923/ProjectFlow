const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  assignedTo: {
    type: String,
    default: "Unassigned"
  },

  dueDate: {
    type: Date
  },

  priority: {
    type: String,
    default: "Medium"
  },

  status: {
    type: String,
    default: "Todo"
  },

  comments: [commentSchema],

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
});

module.exports = mongoose.model("Task", taskSchema);
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentId: String,
  line: Number,
  text: String,
  authorId: String,
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

const versionSchema = new mongoose.Schema({
  version: Number,
  content: String,
  timestamp: { type: Date, default: Date.now },
  editorId: String
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  versionHistory: [versionSchema],
  comments: [commentSchema],
  collaborators: [String]
});

module.exports = mongoose.model('Document', documentSchema);

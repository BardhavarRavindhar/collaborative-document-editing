const Document = require('../models/Document');

// Add a comment to a document
exports.addComment = async (req, res, next) => {
  try {
    const { line, text } = req.body;
    if (!line || !text) {
      return res.status(400).json({ success: false, message: 'Line number and text are required' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!document.collaborators.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const comment = {
      commentId: `comment-${Date.now()}`,
      line,
      text,
      authorId: req.user._id,
      timestamp: new Date(),
      resolved: false
    };

    document.comments.push(comment);
    await document.save();

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// Resolve or delete a comment
exports.resolveComment = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const comment = document.comments.find(
      (comment) => comment.commentId === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.authorId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    document.comments = document.comments.filter(
      (comment) => comment.commentId !== req.params.commentId
    );

    await document.save();
    res.status(200).json({ success: true, message: 'Comment resolved/deleted' });
  } catch (error) {
    next(error);
  }
};

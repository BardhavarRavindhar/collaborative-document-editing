const Document = require('../models/Document');

const commentController = {
  // Add a comment to a document
  addComment: async (req, res, next) => {
    try {
      const { line, text } = req.body;
      if (!line || !text) {
        return res.status(400).json({ success: false, message: 'Line number and text are required' });
      }

      // Find the document by ID
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }

      // Check if the user is a collaborator
      if (!document.collaborators.includes(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Create the new comment
      const comment = {
        commentId: `comment-${Date.now()}`,  // Unique comment ID
        line,  // Line number where the comment is placed
        text,  // Comment text
        authorId: req.user._id,  // User who is adding the comment
        timestamp: new Date(),  // When the comment was created
        resolved: false  // Initially, the comment is unresolved
      };

      // Add the comment to the document's comments array
      document.comments.push(comment);
      await document.save();

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  },

  // Get all comments for a document
  getComments: async (req, res, next) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }

      // Check if the user is a collaborator
      if (!document.collaborators.includes(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Send all comments for the document
      res.status(200).json({ success: true, data: document.comments });
    } catch (error) {
      next(error);
    }
  },

  // Resolve or delete a comment
  resolveComment: async (req, res, next) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }

      // Find the comment by commentId
      const comment = document.comments.find(
        (comment) => comment.commentId === req.params.commentId
      );

      if (!comment) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Check if the current user is the author of the comment
      if (comment.authorId !== req.user._id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Resolve or delete the comment
      document.comments = document.comments.filter(
        (comment) => comment.commentId !== req.params.commentId
      );

      await document.save();
      res.status(200).json({ success: true, message: 'Comment resolved/deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = commentController;

const express = require('express');
const {
  addComment,
  getComments,
  resolveComment,
  deleteComment
} = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Protect all comment routes with authentication middleware
router.use(authMiddleware);

// Add a new comment to a document
router.post('/:documentId/comments', addComment);

// Get all comments for a specific document
router.get('/:documentId/comments', getComments);

// Resolve a comment by ID
router.put('/:documentId/comments/:commentId/resolve', resolveComment);

// Delete a comment by ID
router.delete('/:documentId/comments/:commentId', deleteComment);

module.exports = router;

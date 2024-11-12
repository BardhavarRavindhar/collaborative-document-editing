const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { commentController } = require('../controllers');
const router = express.Router();

// Protect all comment routes with authentication middleware
router.use(authMiddleware);

// Comment routes
router.post('/:id/comments', authMiddleware, commentController.addComment); 
router.get('/:id/comments', authMiddleware, commentController.getComments);  
router.delete('/:id/comments/:commentId', authMiddleware, commentController.resolveComment);


module.exports = router;

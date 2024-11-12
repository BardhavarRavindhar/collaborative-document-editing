const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermissionMiddleware = require('../middlewares/checkPermissionMiddleware');
const { documentController } = require('../controllers');

// Logging middleware to log each request
const logRequestMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
  next();  // Ensure next() is called to proceed to the next middleware or route handler
};

// Add logging for each route with proper ordering
router.post('/', authMiddleware, logRequestMiddleware, documentController.createDocument);

router.get('/', authMiddleware, logRequestMiddleware, documentController.getDocuments);

router.get('/:id', authMiddleware, checkPermissionMiddleware('READ'), logRequestMiddleware, documentController.getDocumentById);

router.put('/:id', authMiddleware, checkPermissionMiddleware('WRITE'), logRequestMiddleware, documentController.updateDocument);

router.delete('/:id', authMiddleware, checkPermissionMiddleware('WRITE'), logRequestMiddleware, documentController.deleteDocument);

module.exports = router;

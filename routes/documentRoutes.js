const express = require('express');
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermissionMiddleware = require('../middlewares/permissionMiddleware');
const router = express.Router();

// Protect all document routes with authentication middleware
router.use(authMiddleware);

// Create a new document
router.post('/', createDocument);

// Get all documents accessible by the authenticated user
router.get('/', getDocuments);

// Get a document by ID with READ permission
router.get('/:id', checkPermissionMiddleware('READ'), getDocumentById);

// Update a document by ID with WRITE permission
router.put('/:id', checkPermissionMiddleware('WRITE'), updateDocument);

// Delete a document by ID with WRITE permission
router.delete('/:id', checkPermissionMiddleware('WRITE'), deleteDocument);

module.exports = router;

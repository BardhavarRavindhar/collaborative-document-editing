const Document = require('../models/Document');

const checkPermissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    const documentId = req.params.id || req.body.documentId; // Get document ID from params or body

    try {
      // Find the document by ID
      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({ success: false, msg: 'Document not found.' });
      }

      // Find the user's permissions for the document
      const userPermission = document.permissions.find(
        (perm) => perm.user.toString() === req.user._id.toString()
      );

      if (!userPermission) {
        return res.status(403).json({ success: false, msg: 'User does not have any permissions for this document.' });
      }

      // Permission hierarchy: 'READ' < 'COMMENT' < 'WRITE' < 'ALL'
      const permissionHierarchy = ['READ', 'COMMENT', 'WRITE', 'ALL'];

      const userPermissionLevel = permissionHierarchy.indexOf(userPermission.permission);
      const requiredPermissionLevel = permissionHierarchy.indexOf(requiredPermission);

      if (userPermissionLevel >= requiredPermissionLevel) {
        // User has the required permission or higher
        return next();
      }

      return res.status(403).json({ success: false, msg: 'You do not have sufficient permissions.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, msg: 'Server error' });
    }
  };
};

module.exports = checkPermissionMiddleware;

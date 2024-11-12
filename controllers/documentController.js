const Document = require('../models/Document');

// Create a new document
exports.createDocument = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const document = await Document.create({
      title,
      content,
      versionHistory: [{ version: 1, content, editorId: req.user._id }],
      collaborators: [req.user._id]
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// Get all documents
exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ collaborators: req.user._id });
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// Get a single document by ID
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!document.collaborators.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// Update a document's content
exports.updateDocument = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!document.collaborators.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    document.content = content;
    document.versionHistory.push({
      version: document.versionHistory.length + 1,
      content,
      editorId: req.user._id
    });

    await document.save();
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// Delete a document
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!document.collaborators.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await document.remove();
    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};

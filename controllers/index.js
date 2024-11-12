// src/controllers/index.js

const documentController = require('./documentController');
const authController = require('./authController');
const commentController = require('./commentController');


module.exports = {
  documentController,
  authController,
  commentController
  // Export other controllers here
};

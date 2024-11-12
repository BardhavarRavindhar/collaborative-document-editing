const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB();


// Create an Express app
const app = express();
const server = createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Ensure this matches the frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Ensure app-level CORS matches the Socket.IO configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const logger = require('./config/logger');
const authMiddleware = require('./middlewares/authMiddleware');

// Route usage
app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api', authMiddleware, commentRoutes); // Comment routes may be nested under /api for consistency

// Error handling middleware
app.use(errorHandler);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO Events
let documentContent = '';

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Socket.IO Connection
  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Listen for joining a document room
    socket.on('joinDocumentRoom', (documentId) => {
      console.log('User joined document room: ', documentId);
      socket.join(documentId);  // User joins the document room by document ID
    });

    // Handle document updates (e.g., text edits)
    socket.on('documentUpdate', (documentId, updatedContent) => {
      console.log('Document updated in room ' + documentId);

      // Emit update to all users in the room except the sender
      socket.to(documentId).emit('documentUpdated', updatedContent);
    });

    // Handle document comments
    socket.on('newComment', (documentId, commentData) => {
      console.log('New comment on document:', documentId);

      // Emit new comment to all users in the room
      socket.to(documentId).emit('commentAdded', commentData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Start server
const port = process.env.PORT || 8002;
server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
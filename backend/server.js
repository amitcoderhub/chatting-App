const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors({ origin: "https://chatting-app-1-f3xo.onrender.com", credentials: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatting-app-1-f3xo.onrender.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const users = {}; // Track active users
const messages = []; // Store chat messages

// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ fileUrl }); // Return the file URL
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user
  socket.on("register_user", (username) => {
    users[socket.id] = { username, lastSeen: new Date(), active: true };
    io.emit("update_users", users);
  });

  // Send chat message
  socket.on("send_message", (data) => {
    const message = { ...data, timestamp: new Date(), read: false };
    messages.push(message);
    io.emit("receive_message", message);
  });

  // Send file message
  socket.on("send_file", (data) => {
    const message = { ...data, timestamp: new Date(), type: "file" };
    messages.push(message);
    io.emit("receive_message", message);
  });

  // Handle message reactions
  socket.on("send_reaction", ({ messageId, reaction }) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      message.reactions = message.reactions || [];
      message.reactions.push({ reaction, user: socket.id });
      io.emit("update_reactions", { messageId, reactions: message.reactions });
    }
  });

  // Typing indicators
  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      users[socket.id].active = false;
      users[socket.id].lastSeen = new Date();
      io.emit("update_users", users);
    }
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
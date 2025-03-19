const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "https://chatting-app-1-f3xo.onrender.com", credentials: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatting-app-1-f3xo.onrender.com"], // ✅ Correct frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // ✅ Allow credentials
  },
});

const users = {}; // Track active users
const messages = []; // Store chat messages (consider using a database)

// ✅ Handle new user connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // ✅ Register user
  socket.on("register_user", (username) => {
    users[socket.id] = { username, lastSeen: new Date(), active: true };
    io.emit("update_users", users); // Broadcast updated user list
  });

  // ✅ Send chat message (Public)
  socket.on("send_message", (data) => {
    const message = { ...data, timestamp: new Date(), read: false };
    messages.push(message); // Store message (consider using a database)
    io.emit("receive_message", message); // Broadcast message
  });

  // ✅ Send private message
  socket.on("send_private_message", ({ sender, receiverId, content }) => {
    const message = { sender, content, timestamp: new Date(), read: false };
    if (users[receiverId]) {
      io.to(receiverId).emit("receive_private_message", message);
    }
  });

  // ✅ Message seen feature
  socket.on("message_seen", (messageId) => {
    messages.forEach((msg) => {
      if (msg.id === messageId) msg.read = true;
    });
    io.emit("update_message_status", { messageId, read: true });
  });

  // ✅ Typing indicators
  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing");
  });

  // ✅ Handle disconnection
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      users[socket.id].active = false;
      users[socket.id].lastSeen = new Date();
      io.emit("update_users", users); // Broadcast updated user list
    }
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start the server
server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

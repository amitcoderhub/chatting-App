const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Add this route to show a message in the browser
app.get("/", (req, res) => {
  res.send("Socket.io server is running! 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://your-frontend.onrender.com", // Change this to your frontend URL
    methods: ["GET", "POST"],
  },
});

const users = {}; // Track active users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for new users
  socket.on("register_user", (username) => {
    users[socket.id] = { username, lastSeen: new Date(), active: true };
    io.emit("update_users", users);
  });

  // Listen for chat messages
  socket.on("send_message", (data) => {
    const message = { ...data, timestamp: new Date(), read: false };
    io.emit("receive_message", message);
  });

  // Listen for typing events
  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  // Listen for stop typing events
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

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

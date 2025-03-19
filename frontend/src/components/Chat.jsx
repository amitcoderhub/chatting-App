import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPaperPlane, FaVideo, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import MessageList from "./MessageList";
import InputBox from "./InputBox";

// Updated to use deployed backend
const socket = io("https://chatting-app-d995.onrender.com", {
  transports: ["websocket"],
  withCredentials: true, // ✅ Important for CORS
});


const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); // Track message input
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Toggle emoji picker
  const [users, setUsers] = useState({}); // Track active users
  const [typingUser, setTypingUser] = useState(""); // Track typing user
  const emojiPickerRef = useRef(null); // Ref for emoji picker container
  const typingTimeoutRef = useRef(null); // Ref for typing timeout

  useEffect(() => {
    // Register the user with the server
    socket.emit("register_user", username);

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user updates
    socket.on("update_users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Listen for typing events
    socket.on("user_typing", (username) => {
      setTypingUser(`${username} is typing...`);
    });

    // Listen for stop typing events
    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    // Cleanup
    return () => {
      socket.off("receive_message");
      socket.off("update_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [username]);

  // Check if the current user is online
  const isUserOnline = Object.values(users).some(
    (user) => user.username === username && user.active
  );

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji); // Append the selected emoji to the message
  };

  // Send message
  const sendMessage = () => {
    if (message.trim()) {
      const data = { username, message, socketId: socket.id };
      socket.emit("send_message", data);
      setMessage(""); // Clear the input box
    }
  };

  // Handle typing events
  const handleTyping = () => {
    socket.emit("typing", username); // Notify other users that this user is typing

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop the typing indicator after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      {/* Mobile-like chat container */}
      <div className="w-full max-w-sm h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-blue-500 text-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Chat App</h1>
            <p className="text-sm flex items-center gap-1">
              Welcome, {username}!
              {isUserOnline && (
                <span className="text-green-500 text-sm">• Online</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Video call functionality coming soon!")}
              className="p-2 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaVideo size={20} />
            </button>
          </div>
        </div>

        {/* Message list */}
        <MessageList messages={messages} username={username} users={users} />

        {/* Typing indicator */}
        {typingUser && (
          <div className="px-4 py-2 text-sm text-blue-500 bg-blue-100">
            {typingUser}
          </div>
        )}

        {/* Input box and emoji picker */}
        <div className="p-3 bg-gray-50 border-t flex items-center gap-2 relative">
          {/* Emoji picker toggle button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <FaSmile size={20} />
          </button>

          {/* Input box */}
          <InputBox
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            onTyping={handleTyping}
          />

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 left-0 z-10"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

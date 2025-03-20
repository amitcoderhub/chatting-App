import React, { useEffect, useRef } from "react";
import { FaCheckDouble } from "react-icons/fa";
import { motion } from "framer-motion";
// import { motion } from "framer-motion"; // ✅ Correct


const MessageList = ({ messages, username, users }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
      {messages.map((msg, index) => {
        const isSenderActive = users[msg.socketId]?.active;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col mb-4 ${
              msg.username === username ? "items-end" : "items-start"
            }`}
          >
            {isSenderActive && msg.username !== username && (
              <span className="text-xs text-green-500 mb-1">
                {msg.username} <span className="text-green-500">• Online</span>
              </span>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[80%] relative ${
                msg.username === username
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg"
              }`}
              style={{
                borderRadius:
                  msg.username === username
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
              }}
            >
              {msg.type === "file" ? (
                <a
                  href={msg.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-300 underline"
                >
                  View File
                </a>
              ) : (
                <p className="text-sm">{msg.message}</p>
              )}

              {/* Reactions */}
              {msg.reactions && (
                <div className="mt-1 flex gap-1">
                  {msg.reactions.map((reaction, idx) => (
                    <span key={idx} className="text-sm">
                      {reaction.reaction}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp and read receipt */}
              <div className="text-[10px] mt-1 flex items-center justify-end gap-1">
                <span
                  className={
                    msg.username === username
                      ? "text-blue-200"
                      : "text-gray-400"
                  }
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {msg.read && (
                  <FaCheckDouble
                    className={
                      msg.username === username
                        ? "text-blue-200"
                        : "text-gray-400"
                    }
                    size={10}
                  />
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
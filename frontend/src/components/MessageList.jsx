import React, { useEffect, useRef } from "react";
import { FaCheckDouble } from "react-icons/fa";

const MessageList = ({ messages, username, users }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((msg, index) => {
        const isSenderActive = users[msg.socketId]?.active;
        return (
          <div
            key={index}
            className={`flex flex-col mb-4 ${
              msg.username === username ? "items-end" : "items-start"
            }`}
          >
            {}
            {isSenderActive && msg.username !== username && (
              <span className="text-xs text-green-500 mb-1">
                {msg.username} <span className="text-green-500">• Online</span>
              </span>
            )}

            {}
            <div
              className={`p-3 rounded-2xl max-w-[80%] relative ${
                msg.username === username
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-800 shadow-lg"
              }`}
              style={{
                borderRadius:
                  msg.username === username
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
              }}
            >
              {/* Message text */}
              <p className="text-sm">{msg.message}</p>

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
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;



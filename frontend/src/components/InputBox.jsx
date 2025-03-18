import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const InputBox = ({ message, setMessage, sendMessage, onTyping }) => {
  const handleSend = () => {
    if (message.trim()) {
      sendMessage();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping(); // Notify other users that this user is typing
  };

  return (
    <div className="flex-1 flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <FaPaperPlane size={18} />
      </button>
    </div>
  );
};

export default InputBox;
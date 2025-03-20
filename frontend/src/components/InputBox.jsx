import React from "react";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const InputBox = ({ message, setMessage, sendMessage, onTyping }) => {
  const handleSend = () => {
    if (message.trim()) {
      sendMessage();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const { fileUrl } = await response.json();
      sendMessage(fileUrl, "file"); // Send the file URL as a message
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center gap-2">
      <input
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="p-2 text-gray-600 hover:text-blue-500 cursor-pointer"
      >
        <FaPaperclip size={18} />
      </label>

      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
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
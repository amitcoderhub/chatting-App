import React, { useState, useEffect } from "react";

const UserSelection = ({ username, onStartChat }) => {
  const [users, setUsers] = useState({}); // Track logged-in users
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user for chat
  const [notification, setNotification] = useState(null); // Track incoming chat requests

  // Mock function to fetch logged-in users (replace with real logic)
  useEffect(() => {
    const fetchLoggedInUsers = () => {
      const mockUsers = {
        user1: { username: "user1", active: true },
        user2: { username: "user2", active: true },
        user3: { username: "user3", active: false },
      };
      setUsers(mockUsers);
    };

    fetchLoggedInUsers();
  }, []);

  // Handle sending a chat request
  const handleRequestToChat = (receiverUsername) => {
    setSelectedUser(receiverUsername);
    // Mock notification to the receiver (replace with real logic)
    const receiverSocketId = Object.keys(users).find(
      (key) => users[key].username === receiverUsername
    );
    if (receiverSocketId) {
      setNotification({
        sender: username,
        receiver: receiverUsername,
        status: "pending",
      });
      alert(`Chat request sent to ${receiverUsername}.`);
    }
  };

  // Handle accept/reject chat request
  const handleChatRequestResponse = (accepted) => {
    if (accepted) {
      onStartChat(selectedUser); // Start chat with the selected user
    } else {
      alert(`${selectedUser} declined your chat request.`);
    }
    setNotification(null); // Clear the notification
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Chatting App By Amit Chauhan
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Logged-In Users:</h2>
          {Object.values(users).map((user, index) => (
            <div
              key={index}
              className="p-2 mb-2 border rounded-lg flex items-center justify-between"
            >
              <span className="text-gray-700">{user.username}</span>
              <button
                onClick={() => handleRequestToChat(user.username)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Request to Chat
              </button>
            </div>
          ))}
        </div>

        {/* Notification for incoming chat requests */}
        {notification && notification.receiver === username && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
              <h2 className="text-xl font-bold mb-4">Chat Request</h2>
              <p className="text-gray-700">
                {notification.sender} wants to chat with you.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleChatRequestResponse(true)}
                  className="flex-1 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleChatRequestResponse(false)}
                  className="flex-1 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelection;
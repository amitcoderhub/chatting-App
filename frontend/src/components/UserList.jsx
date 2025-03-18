import React, { useState } from "react";

const UserList = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="font-bold mb-4 text-gray-800">Active Users</h2>
      {Object.values(users).map((user, index) => (
        <div
          key={index}
          className="mb-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => handleUserClick(user)}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">{user.username}</span>
            {user.active ? (
              <span className="text-green-500 text-sm">• Online</span>
            ) : (
              <span className="text-gray-500 text-sm">
                Last seen: {new Date(user.lastSeen).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Modal to display user information */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              User Information
            </h2>
            <p className="text-gray-700">
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              {selectedUser.active ? "Online" : "Offline"}
            </p>
            <p className="text-gray-700">
              <strong>Last Seen:</strong>{" "}
              {new Date(selectedUser.lastSeen).toLocaleTimeString()}
            </p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
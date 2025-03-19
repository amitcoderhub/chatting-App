import React, { useEffect, useState } from "react";

const LoggedInUsers = ({ username, onEnterChat }) => {
  const [users, setUsers] = useState({}); // Track logged-in users
  const [requests, setRequests] = useState({}); // Track chat requests
  const [notification, setNotification] = useState(""); // Track notifications
  const [showConfirmSection, setShowConfirmSection] = useState(false); // Toggle confirm section

  // Fetch logged-in users and requests from localStorage
  const fetchLoggedInUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || {};
    setUsers(storedUsers);
  };

  const fetchRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem("chatRequests")) || {};
    setRequests(storedRequests);
  };

  // Update logged-in users in localStorage and state
  const updateLoggedInUsers = (updatedUsers) => {
    localStorage.setItem("loggedInUsers", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Update chat requests in localStorage and state
  const updateRequests = (updatedRequests) => {
    localStorage.setItem("chatRequests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  // Add current user to logged-in users
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || {};
    storedUsers[username] = { username, active: true };
    updateLoggedInUsers(storedUsers);

    // Listen for changes in localStorage (to sync across tabs)
    const handleStorageChange = (event) => {
      if (event.key === "loggedInUsers") {
        setUsers(JSON.parse(event.newValue));
      }
      if (event.key === "chatRequests") {
        const updatedRequests = JSON.parse(event.newValue);
        setRequests(updatedRequests);

        // Check if the current user's request was accepted
        if (updatedRequests[username]?.status === "accepted") {
          onEnterChat(); // Redirect to the chat section
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [username, onEnterChat]);

  // Fetch initial data
  useEffect(() => {
    fetchLoggedInUsers();
    fetchRequests();
  }, []);

  // Handle starting a chat
  const handleStartChat = (receiverUsername) => {
    const updatedRequests = {
      ...requests,
      [receiverUsername]: { sender: username, status: "pending" },
    };
    updateRequests(updatedRequests);
    setNotification(`Chat request sent to ${receiverUsername}.`);
  };

  // Handle confirming a chat request
  const handleConfirmChat = (senderUsername) => {
    const updatedRequests = {
      ...requests,
      [senderUsername]: { ...requests[senderUsername], status: "accepted" },
    };
    updateRequests(updatedRequests);
    setNotification(`Chat request accepted. Starting chat with ${senderUsername}.`);
    onEnterChat(); // Redirect to the chat section
  };

  // Toggle confirm section
  const toggleConfirmSection = () => {
    setShowConfirmSection((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {/* Display logged-in user at the top */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Chatting App By Amit Chauhan
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Logged in as: <span className="font-semibold text-blue-500">{username}</span>
          </p>
        </div>

        {notification && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded-lg text-center">
            {notification}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Logged-In Users:
          </h2>
          {Object.values(users).filter((user) => user.active && user.username !== username).length === 0 ? (
            <p className="text-gray-500 text-center">No users online.</p>
          ) : (
            Object.values(users).map((user, index) => (
              user.active && user.username !== username && (
                <div
                  key={index}
                  className="p-4 mb-3 border rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">
                      {user.username}
                    </span>
                    {user.active ? (
                      <span className="ml-2 text-green-500 text-sm">• Online</span>
                    ) : (
                      <span className="ml-2 text-gray-500 text-sm">• Offline</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {requests[user.username]?.sender === username ? (
                      requests[user.username].status === "pending" ? (
                        <span className="text-sm text-gray-500">Request Pending</span>
                      ) : requests[user.username].status === "accepted" ? (
                        <span className="text-sm text-green-500">Chatting</span>
                      ) : (
                        <span className="text-sm text-red-500">Request Rejected</span>
                      )
                    ) : (
                      <button
                        onClick={() => handleStartChat(user.username)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Start Chat
                      </button>
                    )}
                  </div>
                </div>
              )
            ))
          )}
        </div>

        {/* Confirm Section */}
        <div className="mb-6">
          <button
            onClick={toggleConfirmSection}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            {showConfirmSection ? "Hide Confirm Section" : "Show Confirm Section"}
          </button>
          {showConfirmSection && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Pending Chat Requests:
              </h2>
              {Object.values(requests).filter(
                (request) => request.sender !== username && request.status === "pending"
              ).length === 0 ? (
                <p className="text-gray-500 text-center">No pending requests.</p>
              ) : (
                Object.values(requests).map((request, index) => (
                  request.sender !== username && request.status === "pending" && (
                    <div
                      key={index}
                      className="p-4 mb-3 border rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">
                          {request.sender}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConfirmChat(request.sender)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Confirm Chat
                        </button>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoggedInUsers;
import React, { useState } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import LoggedInUsers from "./components/LoggedInUsers";

function App() {
  const [user, setUser] = useState(null); // Track logged-in user
  const [showChat, setShowChat] = useState(false); // Track whether to show chat

  const handleLogin = (username) => {
    setUser(username); // Set the logged-in user
    localStorage.setItem("username", username); // Save username to local storage
  };

  const handleEnterChat = () => {
    setShowChat(true); // Show the chat section
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : !showChat ? (
        <LoggedInUsers username={user} onEnterChat={handleEnterChat} />
      ) : (
        <Chat username={user} />
      )}
    </div>
  );
}

export default App;
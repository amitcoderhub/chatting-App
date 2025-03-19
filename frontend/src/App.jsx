import React, { useState } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null); // Track logged-in user

  const handleLogin = (username) => {
    setUser(username); // Set the logged-in user
    localStorage.setItem("username", username); // Save username to local storage
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? <Chat username={user} /> : <Auth onLogin={handleLogin} />}
    </div>
  );
}

export default App;  
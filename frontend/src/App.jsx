import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("username", username);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
      {user ? <Chat username={user} /> : <Auth onLogin={handleLogin} />}
    </div>
  );
}

export default App;
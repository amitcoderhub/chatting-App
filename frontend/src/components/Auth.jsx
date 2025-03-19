import React, { useState } from "react";

const Auth = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle forgot password
  const [error, setError] = useState(""); // Track error messages
  const [successMessage, setSuccessMessage] = useState(""); // Track success messages

  // Validate phone number (10 digits, +91 optional)
  const validatePhone = (phone) => {
    const regex = /^(\+91)?\d{10}$/;
    return regex.test(phone);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      handleForgotPassword();
      return;
    }

    // Validate fields for registration
    if (!isLogin) {
      if (!name || !email || !phone || !username || !password) {
        setError("All fields are required.");
        return;
      }
      if (!validatePhone(phone)) {
        setError("Phone number must be 10 digits. +91 is optional.");
        return;
      }
      // Check if username is unique
      const isUsernameUnique = checkUsernameUnique(username);
      if (!isUsernameUnique) {
        setError("Username already exists. Please choose another.");
        return;
      }
      // Save user details to localStorage
      saveUserToLocalStorage({ name, email, phone, username, password });
      setSuccessMessage("Registration successful! Please log in.");
      setIsLogin(true); // Redirect to login page
      setError("");
      return;
    }

    // For login, only username and password are required
    if (isLogin) {
      if (!username || !password) {
        setError("Username and password are required.");
        return;
      }
      // Check if the user is registered
      const isRegistered = checkUserRegistered(username, password);
      if (!isRegistered) {
        setError("Invalid username or password.");
        return;
      }
      // If validation passes, call onLogin
      onLogin(username);
      setError("");
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (!username || !email) {
      setError("Username and email are required.");
      return;
    }
    // Check if the user exists
    const user = getUserByUsername(username);
    if (!user || user.email !== email) {
      setError("Invalid username or email.");
      return;
    }
    // Mock password recovery (in a real app, send a reset link via email)
    setSuccessMessage(`Password recovery instructions sent to ${user.email}.`);
    setError("");
  };

  // Check if username is unique
  const checkUsernameUnique = (username) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return !users.some((user) => user.username === username);
  };

  // Save user details to localStorage
  const saveUserToLocalStorage = (user) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Check if user is registered and password matches
  const checkUserRegistered = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.username === username);
    return user && user.password === password;
  };

  // Get user by username
  const getUserByUsername = (username) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find((user) => user.username === username);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isForgotPassword
            ? "Forgot Password"
            : isLogin
            ? "Welcome Back!"
            : "Create an Account"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && !isForgotPassword && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91XXXXXXXXXX or XXXXXXXXXX"
                />
              </div>
            </>
          )}
          {!isForgotPassword && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </>
          )}
          {isForgotPassword && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isForgotPassword
              ? "Recover Password"
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>
        {!isForgotPassword && (
          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        )}
        {isLogin && !isForgotPassword && (
          <p className="mt-4 text-center">
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        )}
        {isForgotPassword && (
          <p className="mt-4 text-center">
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-blue-500 hover:underline"
            >
              Back to Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
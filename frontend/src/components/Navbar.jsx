import React from "react";
import { FaBars } from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="sm:hidden p-4 bg-white border-b flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
      <button onClick={onMenuClick} className="p-2 text-gray-800">
        <FaBars size={20} />
      </button>
    </div>
  );
};

export default Navbar; // Ensure this is the default export
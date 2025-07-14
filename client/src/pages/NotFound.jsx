import React from "react";
import { useNavigate } from "react-router-dom";
import windowcat from "../assets/windowcat.gif";
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 text-center">
      {/* Animated SVG Cat */}
      <div className="w-64 h-64 mb-6">
        <img
          src={windowcat}
          alt="Cute animated cat"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 404 Message */}
      <h1 className="text-6xl font-bold mb-2 text-pink-400 animate-bounce">
        404
      </h1>
      <p className="text-xl md:text-2xl mb-4 text-gray-300">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded-full bg-pink-500 hover:bg-pink-600 transition text-white font-semibold shadow-lg"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;

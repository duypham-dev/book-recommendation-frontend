import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/routePaths.js";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* 404 Image Illustration */}
      <div className="w-full max-w-2xl px-4 mb-2">
        <img 
          src="/404.jpg" 
          alt="404 Hanging Books" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Main Content */}
      <h1 className="text-[120px] sm:text-[150px] font-medium text-[#F4C524] leading-none tracking-tight mb-6">
        404
      </h1>
      
      <h2 className="text-2xl sm:text-3xl text-[#2F3349] font-medium mb-4">
        Looks like you've got lost...
      </h2>
      
      <p className="text-[#848B9B] text-base sm:text-lg mb-8 text-center max-w-md px-4">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link 
        to={PATHS.HOME || "/"} 
        className="text-[#F4C524] font-semibold text-lg hover:text-yellow-500 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

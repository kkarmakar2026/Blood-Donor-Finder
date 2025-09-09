import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LifeConnect Logo.png";

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white h-20 flex items-center px-10 shadow-md">
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="LifeConnect Logo"
          className="h-20 w-auto rounded-full bg-white p-1"
        />
        <h1 className="text-white font-extrabold text-2xl tracking-wide">
          LifeConnect
        </h1>
      </div>

      {/* Center - Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-x-8 text-lg font-semibold">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/donors" className="hover:underline">Find Donors</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/admin/login" className="hover:underline font-bold">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

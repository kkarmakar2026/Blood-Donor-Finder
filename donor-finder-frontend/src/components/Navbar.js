import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">LifeConnect</h1>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/donors" className="hover:underline">Find Donors</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        {/* 🔑 Admin Login link */}
        <Link to="/admin/login" className="hover:underline font-semibold">
          Admin Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

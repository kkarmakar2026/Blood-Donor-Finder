import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger + close icons
import logo from "../assets/LifeConnect Logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left - Logo + Brand Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="LifeConnect Logo"
              className="h-12 w-12 rounded-full bg-white p-1"
            />
            <h1 className="font-extrabold text-2xl tracking-wide leading-tight">
              <span className="block sm:inline">Life</span>
              <span className="block sm:inline">Connect</span>
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 text-lg font-semibold">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/donors" className="hover:underline">Find Donors</Link>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/admin/login" className="hover:underline font-bold">
              Admin Login
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-red-700 px-4 py-3 space-y-2 text-lg font-semibold">
          <Link to="/" className="block hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/donors" className="block hover:underline" onClick={() => setIsOpen(false)}>Find Donors</Link>
          <Link to="/register" className="block hover:underline" onClick={() => setIsOpen(false)}>Register</Link>
          <Link to="/login" className="block hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/contact" className="block hover:underline" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/admin/login" className="block hover:underline font-bold" onClick={() => setIsOpen(false)}>
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

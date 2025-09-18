import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className>
      <div className="container mx-auto py-6 text-center text-sm text-gray-600">

       {/* FOLLOW + CONTACT in one row */}
<div className="flex justify-between items-center max-w-xl mx-auto mb-6">
  {/* FOLLOW US */}
  <div className="flex flex-col items-center">
    <h3 className="text-md font-semibold mb-2">FOLLOW US</h3>
    <div className="flex space-x-4">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
          alt="Facebook"
          className="h-8"
        />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
          alt="Twitter"
          className="h-8"
        />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733646.png"
          alt="YouTube"
          className="h-8"
        />
      </a>
    </div>
  </div>

  {/* CONTACT US */}
  <div className="flex flex-col items-center">
    <h3 className="text-md font-semibold mb-2">CONTACT US</h3>
    <div className="flex gap-6">
      {/* WhatsApp */}
      <a href="https://wa.me/7063232326" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="h-8"
        />
      </a>
      {/* Gmail */}
      <a href="mailto:yourmail@gmail.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
          alt="Gmail"
          className="h-8"
        />
      </a>
      {/* Telegram */}
      <a href="https://t.me/YourTelegramChannel" target="_blank" rel="noopener noreferrer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png"
          alt="Telegram"
          className="h-8"
        />
      </a>
    </div>
  </div>
</div>


        {/* Navigation Links */}
        <div className="mb-2 backgrou">
          <a href="/forgot-password" className="hover:underline mx-2">
            Forgot Password?
          </a>
          |
          <a href="/invite-friends" className="hover:underline mx-2">
            Invite Friends
          </a>
          |      
           <Link to="/contact" className="hover:underline mx-2">
            Contact Us
          </Link>
        </div>

        {/* Footer Note */}
        <p>
          © 2025, All Rights Reserved. Site Designed & Maintained By{" "}
          <span className="font-semibold">LifeConnect</span>
        </p>
      </div>
    </footer>
  );
}

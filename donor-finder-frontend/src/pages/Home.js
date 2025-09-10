import React from "react";
import { Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="text-center py-10 px-4">
      <h1 className="text-4xl font-bold text-red-600">Welcome to LifeConnect</h1>
      <p className="mt-4 text-lg text-gray-700">
        A community-driven platform to connect blood donors and those in need.
      </p>
      <div className="mt-6 space-x-4">
        <Link to="/donors" className="bg-red-600 text-white px-4 py-2 rounded-lg">Find Donor</Link>
        <Link to="/register" className="bg-gray-800 text-white px-4 py-2 rounded-lg">Become Donor</Link>
      </div>

      <CommentSection />
      <Footer />
    </div>
  );
}

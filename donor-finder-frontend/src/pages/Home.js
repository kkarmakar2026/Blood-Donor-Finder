// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import WarningTicker from "../components/WarningTicker";
import FindDonorForm from "../components/FindDonorForm";
import donateBloodPic from "../assets/donate blood pic.png";
import { Footer } from "../components/Footer";

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#e1e8f0" }}
    >
      {/* ✅ Warning Ticker at the top */}
      <WarningTicker />

      {/* ✅ Top-right Navigation Links */}
      <div className="flex justify-end gap-6 pr-36 px-4 mt-2">
        <Link
          to="/faqs"
          className=" text-blue-700 hover:text-red-600 font-medium transition animate-blink"
        >
          FAQs
        </Link>
        <Link
          to="/feedback"
          className="text-blue-700 hover:text-red-600 font-medium transition animate-blink"
        >
          Feedback
        </Link>
      </div>

      {/* ✅ Main Content */}
      <main className="flex-grow flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-4xl space-y-12">
          {/* Donor Search Form */}
          <FindDonorForm />

          {/* Campaign Section */}
          <div className="p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 bg-white shadow">
            {/* Image */}
            <img
              src={donateBloodPic}
              alt="Donate Blood"
              className="w-32 h-auto"
            />

            {/* Text Section */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-red-600 mb-4">
                WISH TO DONATE BLOOD?
              </h3>
              <p className="text-gray-700 mb-4 text-lg">
                Join our voluntary blood donor community and save lives. Find
                donors, donate blood safely, and give hope to patients in urgent
                need.
              </p>
              <Link
                to="/register"
                className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition"
              >
                REGISTER AS VOLUNTARY BLOOD DONOR
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Footer at bottom */}
      <Footer />
    </div>
  );
};

export default Home;

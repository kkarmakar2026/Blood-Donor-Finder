import React from "react";
import { Link } from "react-router-dom";
import FindDonorForm from "../components/FindDonorForm";
import donateBloodPic from "../assets/donate blood pic.png"; 

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-4xl space-y-12">
          {/* Donor Form */}
          <FindDonorForm />

          {/* Campaign Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
            {/* Image */}
            <img
              src={donateBloodPic}
              alt="Donate Blood"
              className="w-64 h-auto rounded-xl shadow-md"
            />

            {/* Text Section */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-red-600 mb-4">
                WISH TO DONATE BLOOD/PLASMA?
              </h3>
              <p className="text-gray-700 mb-4 text-lg">
                Your small act of kindness can save lives. Join our community of
                voluntary blood donors and make a difference today.
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
    </div>
  );
};

export default Home;

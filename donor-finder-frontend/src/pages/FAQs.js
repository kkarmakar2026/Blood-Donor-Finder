// src/pages/FAQs.js
import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

const FAQs = () => {
  const faqs = [
    {
      q: "What is the purpose of this platform?",
      a: "This platform connects voluntary blood donors with patients who are in urgent need. Our mission is to ensure that no life is lost due to lack of blood availability."
    },
    {
      q: "Is registering as a donor free?",
      a: "Yes, registering as a donor is completely free of cost. We do not charge donors or patients for using this service."
    },
    {
      q: "How do I request blood?",
      a: "Simply visit the Find Donor section of the website, choose your required blood group and location, and you’ll get a list of available donors you can contact directly."
    },
    {
      q: "How can I update my availability status?",
      a: "Once you log in to your account, you can change your availability to 'Available' or 'Not Available' anytime, based on your current situation."
    },
    {
      q: "Is my personal information safe?",
      a: "Yes, we only display the essential details (like name, city, and contact number) for requestors to reach you. Your data is securely stored and never sold to third parties."
    },
    {
      q: "Can I register even if I don’t know my blood group?",
      a: "No. You must know your blood group to register as a donor. If you don’t know it, you can get it tested at any nearby clinic or hospital."
    },
    {
      q: "Who can become a blood donor?",
      a: "Any healthy individual aged 18–60 years, weighing more than 50kg, and not suffering from any major illness, can become a blood donor."
    },
    {
      q: "How often can I donate blood?",
      a: "Men can donate once every 3 months, while women can donate once every 4 months, depending on health conditions."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* FAQ Content */}
      <main className="flex-grow pt-6 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* ✅ FAQs inside one container */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-red-500 shadow">
          <h2 className="text-2xl font-bold text-red-600 mb-6">FAQs</h2>
          <ul className="space-y-4 text-gray-800">
            {faqs.map((item, index) => (
              <li key={index}>
                <span className="font-semibold text-red-600">
                  Q{index + 1}.
                </span>{" "}
                <span className="font-medium">{item.q}</span>
                <br />
                <span className="text-sm text-gray-700">→ {item.a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <Link
            to="/register"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl shadow hover:bg-red-700 transition"
          >
            Join as a Volunteer / Donor
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQs;

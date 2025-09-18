import React from "react";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 shadow-lg bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
      <p className="text-gray-700 text-center">
        If you need assistance, reach out to us:
      </p>
      <div className="mt-6 space-y-2 text-center">
        <p>Email: support@lifeconnect.org</p>
        <p>Phone: +91 7063232326</p>
        <p>Address: Sodepur, Hooghly, WB-712415, India</p>
      </div>
    </div>
  );
}

import React from "react";

const DonorCard = ({ donor }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{donor.full_name}</h2>
      <p>
        <strong>Email:</strong> {donor.email}
      </p>
      <p>
        <strong>Phone:</strong> {donor.phone}
      </p>
      <p>
        <strong>City:</strong> {donor.city}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {donor.availability ? "Available" : "Not Available"}
      </p>
    </div>
  );
};

export default DonorCard;

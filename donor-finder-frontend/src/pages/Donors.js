import React, { useEffect, useState } from "react";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDonors = async (cityFilter = "", bloodGroupFilter = "") => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/donors";
      if (cityFilter || bloodGroupFilter) {
        const params = new URLSearchParams();
        if (cityFilter) params.append("city", cityFilter);
        if (bloodGroupFilter) params.append("blood_group", bloodGroupFilter);
        url += "/search?" + params.toString();
      }
      const res = await fetch(url);
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Donors</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded p-2 w-full md:w-1/3"
        />
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border rounded p-2 w-full md:w-1/3"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <button
          onClick={() => fetchDonors(city.trim(), bloodGroup)}
          className="bg-red-600 text-white rounded p-2 w-full md:w-1/6 hover:bg-red-700 transition"
        >
          Search
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-center text-gray-500">No donors found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Blood Group</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">City</th>
                <th className="py-2 px-4 border">Availability</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor.donor_id} className="text-center">
                  <td className="py-2 px-4 border">{donor.full_name}</td>
                  <td className="py-2 px-4 border">{donor.blood_group}</td>
                  <td className="py-2 px-4 border">{donor.phone}</td>
                  <td className="py-2 px-4 border">{donor.city}</td>
                  <td className="py-2 px-4 border">
                    {donor.availability ? "Available" : "Not Available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Donors;



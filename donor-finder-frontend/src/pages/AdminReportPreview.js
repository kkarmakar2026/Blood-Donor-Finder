// src/pages/AdminReportPreview.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminReportPreview = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/reports?search=${search}`
      );
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError("❌ Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search]);

 const resolveReport = async (id) => {
    console.log("🟢 Attempting to resolve report with ID:", id);
  if (!window.confirm("Mark this report as resolved?")) return;

  try {
    console.log("📦 Token being sent:", token); // log token
    const token = localStorage.getItem("adminToken"); // Make sure you save token on login

    const res = await fetch(
      `http://localhost:5000/api/admin/reports/${id}/resolve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
     
          console.log("📡 Resolve response status:", res.status); // log status

    if (res.ok) {
        console.log("✅ Report resolved, refreshing list...");
      fetchReports(); // refresh the list
    } else {
      const errData = await res.json();
      alert("❌ Failed: " + (errData.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Resolve error:", err);
    
    alert("❌ Network error while resolving report");
  }
};

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 hover:text-red-600">
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Pending Reports</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by donor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-2 border">Donor Name</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Reported At</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r) => (
                
                <tr key={r.report_id} className="hover:bg-gray-100">
                  <td className="border p-2">{r.full_name}</td>
                  <td className="border p-2">{r.reason}</td>
                  <td className="border p-2">{r.description}</td>
                  <td className="border p-2">
                    {new Date(r.reported_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button
  onClick={() => resolveReport(r.report_id)}
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
>
  Resolve
</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportPreview;

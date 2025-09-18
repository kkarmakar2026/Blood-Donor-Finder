import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ResolvedReport = () => {
  const [resolvedReports, setResolvedReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const navigate = useNavigate();

  // ✅ Fetch resolved reports from backend
  const fetchResolvedReports = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/resolved_reports?page=${currentPage}&limit=${limit}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();

      // Defensive defaults
      setResolvedReports(Array.isArray(data.reports) ? data.reports : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (err) {
      console.error("Failed to fetch resolved reports:", err);
      setResolvedReports([]);
      setTotal(0);
    }
  }, [currentPage, search, navigate]);

  useEffect(() => {
    fetchResolvedReports();
  }, [fetchResolvedReports]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const renderPagination = () => (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (
            totalPages <= 7 ||
            Math.abs(pageNum - currentPage) <= 2 ||
            pageNum === 1 ||
            pageNum === totalPages
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}
      </div>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-black font-medium hover:text-red-600"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Resolved Reports</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by donor name or reason..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={fetchResolvedReports}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Resolved Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="p-2 border">Donor Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Contact No</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Reported At</th>
              <th className="p-2 border">Resolved At</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(resolvedReports) && resolvedReports.length > 0 ? (
              resolvedReports.map((r) => (
                <tr key={r.resolved_id} className="hover:bg-gray-100">
                  <td className="border p-2">{r.full_name}</td>
                  <td className="border p-2">{r.email}</td>
                  <td className="border p-2">{r.phone}</td>
                  <td className="border p-2">{r.reason}</td>
                  <td className="border p-2">{r.description}</td>
                  <td className="border p-2">
                    {new Date(r.reported_at).toLocaleString()}
                  </td>
                  <td className="border p-2 text-green-600 font-bold">
                    {new Date(r.resolved_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No resolved reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ResolvedReport;

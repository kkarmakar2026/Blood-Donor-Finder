import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AdminReportPreview = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const limit = 10;
  const navigate = useNavigate();

  // ✅ Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/reports?page=${currentPage}&limit=${limit}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setReports(Array.isArray(data.reports) ? data.reports : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError("❌ Failed to fetch reports");
      setReports([]);
    }
  }, [search, currentPage, navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ✅ Handle row click
  const handleRowClick = (report) => {
    setSelectedReport(report);
  };

  // ✅ Handle resolve button click
  const handleResolveClick = () => {
    setResolutionNotes("");
    setShowModal(true);
    setPopupPosition({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 });
  };

  // ✅ Submit resolution
  const submitResolution = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/reports/${selectedReport.report_id}/resolve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution_notes: resolutionNotes }),
        }
      );

      if (res.ok) {
        setShowModal(false);
        setSuccessMessage("✅ Issue resolved successfully!");
        setSelectedReport(null);
        setTimeout(() => {
          setSuccessMessage("");
          fetchReports();
        }, 5000);
      } else {
        const errData = await res.json();
        alert("❌ Failed: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Resolve error:", err);
      alert("❌ Network error while resolving report");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ✅ Pagination Renderer
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

  // ✅ Handle Drag Events
  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - popupPosition.x,
      y: e.clientY - popupPosition.y,
    });
  };

  const onDrag = (e) => {
    if (dragging) {
      setPopupPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const stopDrag = () => {
    setDragging(false);
  };

  return (
    <div className="p-6" onMouseMove={onDrag} onMouseUp={stopDrag}>
      <button onClick={() => navigate(-1)} className="mb-4 hover:text-red-600">
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Pending Reports</h1>
      {error && <p className="text-red-600">{error}</p>}
      {successMessage && (
        <p className="bg-green-100 text-green-700 p-2 rounded">
          {successMessage}
        </p>
      )}

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-2 border">Donor Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Reported At</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r) => (
                <tr
                  key={r.report_id}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    selectedReport?.report_id === r.report_id
                      ? "bg-yellow-100"
                      : ""
                  }`}
                  onClick={() => handleRowClick(r)}
                >
                  <td className="border p-2">{r.full_name}</td>
                  <td className="border p-2">{r.email}</td>
                  <td className="border p-2">{r.phone}</td>
                  <td className="border p-2">{r.reason}</td>
                  <td className="border p-2">{r.description}</td>
                  <td className="border p-2">
                    {new Date(r.reported_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Resolve Button (only if row is selected) */}
      {selectedReport && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResolveClick}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Resolve Selected Report
          </button>
        </div>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg w-1/3"
            style={{
              position: "absolute",
              top: popupPosition.y,
              left: popupPosition.x,
            }}
          >
            <div
              className="flex justify-between items-center bg-gray-200 px-4 py-2 cursor-move rounded-t-lg"
              onMouseDown={startDrag}
            >
              <h2 className="text-lg font-bold">Resolve Report</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-600 font-bold"
              >
                ✖
              </button>
            </div>
            <div className="p-6">
              <textarea
                placeholder="Write what work you have done..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows="4"
              />
              <div className="flex justify-between">
                <button
                  onClick={submitResolution}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Resolve Issue
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default AdminReportPreview;


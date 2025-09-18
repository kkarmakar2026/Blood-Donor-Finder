import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AdminFeedbackReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const limit = 10;
  const navigate = useNavigate();

  const tableRef = useRef(null);

  // ✅ Fetch feedback from backend
  const fetchFeedbacks = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/feedback?page=${currentPage}&limit=${limit}&search=${search}`,
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
      setFeedbacks(data.feedbacks);
      setTotal(data.total);
    } catch (err) {
      console.error("Fetch feedback error:", err);
      setError("❌ Failed to load feedback");
    }
  }, [currentPage, search, navigate]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ✅ Delete feedback
  const deleteFeedback = async () => {
    if (!selectedFeedback) return;
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/feedback/${selectedFeedback.feedback_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setError("❌ Failed to delete feedback");
        setConfirmDelete(false);
        return;
      }

      setConfirmDelete(false);
      setSelectedFeedback(null); // ✅ reset after delete
      fetchFeedbacks();
    } catch (err) {
      console.error("Delete feedback error:", err);
      setError("❌ Failed to delete feedback");
      setConfirmDelete(false);
      setSelectedFeedback(null);
    }
  };

  // ✅ Hide selection when clicking outside table, button, and modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(e.target) &&
        !e.target.closest("#delete-button") &&
        !e.target.closest("#delete-modal")
      ) {
        setSelectedFeedback(null);
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Drag handlers for modal
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - popupPosition.x,
      y: e.clientY - popupPosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPopupPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // ✅ Pagination rendering
  const renderPagination = () => (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
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
        onClick={() => setCurrentPage(currentPage + 1)}
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

      <h1 className="text-2xl font-bold mb-4">Feedback Review</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Search bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => fetchFeedbacks()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Feedback</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((f) => (
                <tr
                  key={f.feedback_id}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    selectedFeedback?.feedback_id === f.feedback_id
                      ? "bg-yellow-100"
                      : ""
                  }`}
                  onClick={() => setSelectedFeedback(f)}
                >
                  <td className="border p-2">{f.name}</td>
                  <td className="border p-2">{f.email}</td>
                  <td className="border p-2">{f.mobile}</td>
                  <td className="border p-2">{f.feedback}</td>
                  <td className="border p-2">
                    {new Date(f.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Show Delete button outside table if row is selected */}
        {selectedFeedback && (
          <div className="mt-3 flex justify-end">
            <button
              id="delete-button"
              onClick={() => setConfirmDelete(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Confirm Delete Modal */}
      {confirmDelete && selectedFeedback && (
        <div
          id="delete-modal"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div
            className="bg-white p-6 rounded shadow-md space-y-4 relative"
            style={{
              transform: `translate(${popupPosition.x}px, ${popupPosition.y}px)`,
            }}
          >
            {/* draggable header */}
            <div
              className="flex justify-between items-center cursor-move"
              onMouseDown={handleMouseDown}
            >
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setSelectedFeedback(null); // ✅ reset on cancel
                }}
                className="text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p>
              Are you sure you want to delete feedback from{" "}
              <span className="font-semibold">{selectedFeedback?.name}</span>?
            </p>
            <div className="flex gap-4 mt-4 justify-start">
              <button
                onClick={deleteFeedback}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setSelectedFeedback(null); // ✅ reset on cancel
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackReview;

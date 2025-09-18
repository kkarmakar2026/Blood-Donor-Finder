import React, { useEffect, useState } from "react";
import ReportModal from "../components/ReportModal"; // make sure the path is correct

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // New report submission form
  const [newReportForm, setNewReportForm] = useState({
    donor_name: "",
    reason: "",
    description: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalForm, setModalForm] = useState({ reason: "", description: "" });

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/reports");
      const data = await res.json();
      if (Array.isArray(data)) setReports(data);
      else setReports([]);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle status change
  const handleStatusChange = (report, status) => {
    if (status === "resolved") {
      setSelectedReport(report);
      setNewStatus(status);
      setShowConfirm(true);
    } else {
      updateReportStatus(report.report_id, status);
    }
  };

  // Update report status
  const updateReportStatus = async (report_id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/${report_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Backend error on status update:", errData);
        return;
      }
      fetchReports();
    } catch (err) {
      console.error("Failed to update report status:", err);
    }
  };

  // Confirm resolving a report
  const confirmResolved = () => {
    if (selectedReport) {
      updateReportStatus(selectedReport.report_id, newStatus);
      setShowConfirm(false);
      setSelectedReport(null);
      setNewStatus("");
    }
  };

  const cancelResolved = () => {
    setShowConfirm(false);
    setSelectedReport(null);
    setNewStatus("");
  };

  // Submit a new report from the main form
  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReportForm),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Backend error:", errData);
        return;
      }
      setNewReportForm({ donor_name: "", reason: "", description: "" });
      fetchReports();
    } catch (err) {
      console.error("Failed to submit report:", err);
    }
  };

  // Handle form input changes
  const handleNewReportChange = (e) => {
    const { name, value } = e.target;
    setNewReportForm({ ...newReportForm, [name]: value });
  };

  // Handle modal submission
  const handleModalSubmit = async (form, donor) => {
    if (!donor) return;

    const payload = {
      donor_name: donor.full_name,
      email: donor.email,
      blood_group: donor.blood_group,
      reason: form.reason,
      description: form.description,
    };

    try {
      const res = await fetch("http://localhost:5000/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Backend error on modal report submission:", errData);
        return;
      }
      setShowModal(false);
      setSelectedDonor(null);
      setModalForm({ reason: "", description: "" });
      fetchReports();
    } catch (err) {
      console.error("Failed to submit modal report:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donor Reports</h1>

      {/* New Report Form */}
      <div className="mb-6 border p-4 rounded bg-gray-50 shadow">
        <h2 className="text-lg font-semibold mb-2">Submit New Report</h2>
        <form className="grid grid-cols-1 gap-3" onSubmit={submitReport}>
          <div>
            <label className="block text-sm font-semibold">Full Name:</label>
            <input
              type="text"
              name="donor_name"
              value={newReportForm.donor_name}
              onChange={handleNewReportChange}
              placeholder="Full Name"
              className="border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Report Against:</label>
            <select
              name="reason"
              value={newReportForm.reason}
              onChange={handleNewReportChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select reason</option>
              <option value="wrong number">Wrong Number</option>
              <option value="phone no using someone else">Phone No Using Someone Else</option>
              <option value="donors location changed">Donor's Location Changed</option>
              <option value="donated recently">Donated Recently</option>
              <option value="can't donate anymore">Can't Donate Anymore</option>
              <option value="denied to donate">Denied to Donate</option>
              <option value="spam">Report As Spam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Report Description:</label>
            <textarea
              name="description"
              value={newReportForm.description}
              onChange={handleNewReportChange}
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Enter details..."
              required
            ></textarea>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Report
          </button>
        </form>
      </div>

      {/* Reports Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Donor Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Blood Group</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Reported At</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reports) && reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r.report_id} className="text-center">
                <td className="p-2 border">{r.donor_name}</td>
                <td className="p-2 border">{r.email}</td>
                <td className="p-2 border">{r.blood_group}</td>
                <td className="p-2 border">{r.reason}</td>
                <td className="p-2 border">{r.description}</td>
                <td className="p-2 border">{new Date(r.reported_at).toLocaleString()}</td>
                <td className="p-2 border">
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center">
                No reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirm && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Resolve</h2>
            <p className="mb-4">
              Are you sure you want to mark this report as <strong>Resolved</strong> and delete the user <strong>{selectedReport.donor_name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button onClick={cancelResolved} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
              <button onClick={confirmResolved} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <ReportModal
        donor={selectedDonor}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        form={modalForm}
        setForm={setModalForm}
      />
    </div>
  );
};

export default AdminReports;

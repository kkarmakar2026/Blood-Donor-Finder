import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import ReportModal from "./ReportModal";

const FindDonorForm = () => {
  const [form, setForm] = useState({
    blood_group: "",
    country: "",
    state: "",
    district: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [reportForm, setReportForm] = useState({
    reason: "wrong number",
    description: "",
  });


  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const usersPerPage = 10;

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (form.country) {
      setStates(State.getStatesOfCountry(form.country));
      setForm((prev) => ({ ...prev, state: "", city: "", district: "" }));
    }
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDonors([]);
    setCurrentPage(1); // reset page when searching again

    try {
      const res = await fetch("http://localhost:5000/api/users/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      if (data.length === 0) setError("No donors found matching your criteria.");
      setDonors(data);
    } catch (err) {
      console.error("Search fetch error:", err);
      setError("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Report Handlers
  const handleOpenReport = (donor) => {
    setSelectedDonor(donor);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    console.log("Submitting report:", {
      donor: selectedDonor,
      ...reportForm,
    });
    // 👉 API call goes here
    setShowReportModal(false);
    setReportForm({ reason: "wrong number", description: "" });
  };

  // ✅ Pagination logic applied on donors
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentDonors = showAll
    ? donors
    : donors.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(donors.length / usersPerPage);

  return (
    <>
      {/* 🔴 Find Donors Form */}
      <div className="bg-red-600 text-white p-4 md:p-6 rounded-lg max-w-md mx-auto mt-6">
        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold mb-3 text-center">
            FIND BLOOD DONORS
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-2 mb-4 text-sm"
          >
            {/* Blood Group */}
            <select
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              className="p-1.5 text-sm rounded text-black"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="A1+">A1+</option>
              <option value="A1-">A1-</option>
              <option value="A1B+">A1B+</option>
              <option value="A1B-">A1B-</option>
              <option value="A2+">A2+</option>
              <option value="A2-">A2-</option>
              <option value="A2B+">A2B+</option>
              <option value="A2B-">A2B-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="Bombay Blood Group">Bombay Blood Group</option>
              <option value="INRA">INRA</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            {/* Country */}
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="p-1.5 text-sm rounded text-black"
              required
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State */}
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="p-1.5 text-sm rounded text-black"
              required
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* District */}
            <input
              type="text"
              name="district"
              placeholder="Enter District"
              value={form.district}
              onChange={handleChange}
              className="p-1.5 text-sm rounded text-black"
              required
            />

            {/* City */}
            <input
              type="text"
              name="city"
              placeholder="Enter City/Village"
              value={form.city}
              onChange={handleChange}
              className="p-1.5 text-sm rounded text-black"
              required
            />

            {/* Submit */}
            <button
              type="submit"
              className="bg-white text-red-600 font-bold px-4 py-2 rounded hover:bg-gray-200"
            >
              {loading ? "Searching..." : "SEARCH"}
            </button>
          </form>

          {/* Error */}
          {error && <p className="text-yellow-300 mb-3">{error}</p>}
        </div>
      </div>

      {/* ✅ Search Results */}
      {donors.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-bold mb-4 text-red-600">
            Matched Donors
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded shadow">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-center">Name</th>
                  <th className="py-2 px-4 text-center">WhatsApp</th>
                  <th className="py-2 px-4 text-center">Phone</th>
                  <th className="py-2 px-4 text-center">Availability</th>
                  <th className="py-2 px-4 text-center">Report</th>
                </tr>
              </thead>
              <tbody>
                {currentDonors.map((d) => (
                  <tr key={d.user_id} className="border-b">
                    <td className="py-2 px-4 text-center">{d.full_name}</td>
                    <td className="py-2 px-4 text-center">{d.phone}</td>
                    <td className="py-2 px-4 text-center">{d.whatsapp || "-"}</td>
                    <td className="py-2 px-4 text-center">
                      {d.availability ? (
                        <span className="text-green-600 font-semibold">Available</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Not Available</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleOpenReport(d)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination (styled like you wanted) */}
          {!showAll && totalPages >= 1 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ✅ Report Modal */}
      <ReportModal
        donor={selectedDonor}
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
        form={reportForm}
        setForm={setReportForm}
      />
    </>
  );
};

export default FindDonorForm;

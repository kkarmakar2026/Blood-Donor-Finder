import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
  "A1+",
  "A1-",
  "A1B+",
  "A1B-",
  "A2+",
  "A2-",
  "A2B+",
  "A2B-",
  "Bombay Blood Group",
  "INRA",
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "" || null,
    country: "",
    state: "",
    district: "",
    city: "",
    password: "",
    blood_group: "",
    availability: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const usersPerPage = 10;

  // confirmation modals
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const navigate = useNavigate();

  // drag states
  const [dragging, setDragging] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ✅ Drag handlers
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

  const handleMouseUp = () => {
    setDragging(false);
  };

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

  // Helper functions
  const getCountryName = (countryCode) => {
    if (!countryCode) return "";
    const country = Country.getCountryByCode(countryCode);
    return country ? country.name : countryCode;
  };

  const getStateName = (countryCode, stateCode) => {
    if (!countryCode || !stateCode) return "";
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode;
  };

  // ✅ Fetch all users
  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      return;
    }

    const data = await res.json();
    setUsers(data);
  }, [navigate]);

  // ✅ Delete user
  const deleteUser = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser.user_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to delete user");
        setConfirmDelete(false);
        return;
      }

      setConfirmDelete(false);
      setSelectedUser(null);
      setSuccess("Deleted successfully!");
      await fetchUsers();
      setTimeout(() => setSuccess(""), 5000);

      // adjust pagination after deletion
      setTimeout(() => {
        const filteredLength = users.length - 1;
        const newTotalPages = Math.max(
          1,
          Math.ceil(filteredLength / usersPerPage)
        );
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
      setConfirmDelete(false);
    }
  };

  // ✅ Handle form changes (fix availability boolean)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue;
    if (type === "checkbox") newValue = checked;
    else if (name === "availability") newValue = value === "true";
    else newValue = value;

    setForm({ ...form, [name]: newValue });
  };

  // ✅ Add or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("adminToken");

    // Phone validation
    const phoneRegex = /^\+91\s\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Invalid phone format. Use +91 9090909090");
      return;
    }
    if (form.whatsapp && !phoneRegex.test(form.whatsapp)) {
      setError("Invalid WhatsApp format. Use +91 9090909090");
      return;
    }

    try {
      const res = await fetch(
        editingUser
          ? `http://localhost:5000/api/admin/users/${editingUser.user_id}`
          : "http://localhost:5000/api/admin/users",
        {
          method: editingUser ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.status === 400) {
        const errData = await res.json();
        setError(errData.error || "Validation error");
        return;
      }

      setForm({
        full_name: "",
        email: "",
        phone: "",
        whatsapp: "",
        country: "",
        state: "",
        district: "",
        city: "",
        password: "",
        blood_group: "",
        availability: true,
      });
      setEditingUser(null);
      setConfirmUpdate(false);
      setSuccess("Updated successfully!");
      fetchUsers();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  // ✅ Prefill for editing
  const editUser = (user) => {
    setEditingUser(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp || "",
      country: user.country,
      state: user.state,
      district: user.district,
      city: user.city,
      password: "",
      blood_group: user.blood_group,
      availability: user.availability,
    });
  };

  useEffect(() => {
    fetchUsers();

    // ✅ Hide update/delete on outside click
    const handleClickOutside = (e) => {
      if (!e.target.closest("tr") && !e.target.closest(".actions-panel")) {
        setSelectedUser(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [fetchUsers]);

  // ✅ Auto logout after 10 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("adminToken");
      setSuccess("");
      alert("Admin session expired. You will be logged out.");
      navigate("/admin/login");
    }, 600000);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Filtered users (search)
  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = showAll
    ? filteredUsers
    : filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Error / Success */}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search user by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {"Show All"}
        </button>
      </div>

      {/* Users Table */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Country</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Blood Group</th>
            <th className="p-2 border">Availability</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr
              key={u.user_id}
              className={`cursor-pointer ${
                selectedUser?.user_id === u.user_id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <td className="border p-2">{u.full_name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.phone}</td>
              <td className="border p-2">{getCountryName(u.country)}</td>
              <td className="border p-2">{getStateName(u.country, u.state)}</td>
              <td className="border p-2">{u.city}</td>
              <td className="border p-2">{u.blood_group}</td>
              <td className="border p-2">
                {u.availability ? "Available" : "Not Available"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination (bottom-right) */}
      {!showAll && totalPages >= 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

      {/* Actions */}
      {selectedUser && (
        <div className="mt-4 flex gap-4 actions-panel">
          <button
            onClick={() => {
              editUser(selectedUser);
              setConfirmUpdate(true);
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
{confirmDelete && selectedUser && (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
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
          onClick={() => setConfirmDelete(false)}
          className="text-gray-600 font-bold text-lg"
        >
          ✕
        </button>
      </div>
      <p>Are you sure you want to delete {selectedUser?.full_name}?</p>
      <div className="col-span-2 flex gap-4 mt-4 justify-start">
        <button
          onClick={deleteUser}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Confirm Update Modal */}
{confirmUpdate && selectedUser && (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div
      className="bg-white p-6 rounded shadow-md w-1/2 relative"
      style={{
        transform: `translate(${popupPosition.x}px, ${popupPosition.y}px)`,
      }}
    >
      {/* draggable header */}
      <div
        className="flex justify-between items-center cursor-move mb-4"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-bold text-lg">Update User</h3>
        <button
          onClick={() => setConfirmUpdate(false)}
          className="text-gray-600 font-bold text-lg"
        >
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="district"
          value={form.district}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Country Dropdown */}
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled={!form.country}
        >
          <option value="">Select State</option>
          {State.getStatesOfCountry(form.country).map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Blood Group Dropdown */}
        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg, idx) => (
            <option key={idx} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        {/* Availability Dropdown */}
        <select
          name="availability"
          value={form.availability ? "true" : "false"}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded col-span-1"
        >
          Save
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
   )}

    </div>
  );
};

export default AdminDashboard;

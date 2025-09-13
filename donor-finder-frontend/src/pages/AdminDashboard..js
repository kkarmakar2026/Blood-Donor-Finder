import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
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

  const navigate = useNavigate();

  // Helper functions
const getCountryName = (countryCode) => {
  if (!countryCode) return "";
  const country = Country.getCountryByCode(countryCode);
  return country ? country.name : countryCode;  // only name
};

const getStateName = (countryCode, stateCode) => {
  if (!countryCode || !stateCode) return "";
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state ? state.name : stateCode;  // only name
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
  const deleteUser = async (id) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Add or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      fetchUsers();
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
  }, [fetchUsers]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Error */}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Add/Edit User Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-3 bg-gray-100 p-4 rounded-lg"
      >
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="+91 9090909090"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="whatsapp"
          placeholder="+91 9090909090 (optional)"
          value={form.whatsapp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Country */}
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
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
          className="border p-2 rounded"
          required
        >
          <option value="">Select State</option>
          {State.getStatesOfCountry(form.country).map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="district"
          placeholder="District"
          value={form.district}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City / Village"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Blood Group */}
        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Blood Group</option>
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

        {/* Availability */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available
        </label>

        {/* Password (only for new user) */}
        {!editingUser && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        )}

        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingUser ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Users Table */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">WhatsApp</th>
            <th className="p-2 border">Country</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">District</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Blood Group</th>
            <th className="p-2 border">Available</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
  {users.map((u) => (
    <tr key={u.user_id}>
      <td className="border p-2">{u.full_name}</td>
      <td className="border p-2">{u.email}</td>
      <td className="border p-2">{u.phone}</td>
      <td className="border p-2">{u.whatsapp || "-"}</td>
      <td className="border p-2">{getCountryName(u.country)}</td>
      <td className="border p-2">{getStateName(u.country, u.state)}</td>
      <td className="border p-2">{u.district}</td>
      <td className="border p-2">{u.city}</td>
      <td className="border p-2">{u.blood_group}</td>
      <td className="border p-2">{u.availability ? "✅" : "❌"}</td>
      <td className="border p-2 space-x-2">
        <button
          onClick={() => editUser(u)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => deleteUser(u.user_id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default AdminDashboard;

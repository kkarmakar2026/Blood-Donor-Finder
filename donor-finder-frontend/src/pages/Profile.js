import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const data = await res.json();
      setUser(data);
      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        country: data.country || "",
        state: data.state || "",
        district: data.district || "",
        city: data.city || "",
        blood_group: data.blood_group || "",
      });
    })();
  }, [token, navigate]);

  const startEdit = () => setEditing(true);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return;
      }

      setUser(data.user);
      setEditing(false);
      setSuccess("✅ Profile updated successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("❌ Server error, try again later");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  // ✅ Convert country & state codes to full names
  const countryName = user.country
    ? Country.getCountryByCode(user.country)?.name || user.country
    : "";
  const stateName = user.state && user.country
    ? State.getStateByCodeAndCountry(user.state, user.country)?.name || user.state
    : "";

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {!editing ? (
        <div>
          <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Full Name</td>
                <td className="border px-4 py-2">{user.full_name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Email</td>
                <td className="border px-4 py-2">{user.email}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Phone</td>
                <td className="border px-4 py-2">{user.phone}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">WhatsApp</td>
                <td className="border px-4 py-2">{user.whatsapp || "-"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Country</td>
                <td className="border px-4 py-2">{countryName}</td> {/* ✅ show full name */}
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">State</td>
                <td className="border px-4 py-2">{stateName}</td> {/* ✅ show full name */}
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">District</td>
                <td className="border px-4 py-2">{user.district}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">City</td>
                <td className="border px-4 py-2">{user.city}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Blood Group</td>
                <td className="border px-4 py-2">{user.blood_group}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              onClick={startEdit}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submitUpdate} className="flex flex-col gap-3">
          <input
            name="full_name"
            value={form.full_name || ""}
            onChange={handle}
            placeholder="Full Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="email"
            value={form.email || ""}
            onChange={handle}
            placeholder="Email"
            type="email"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handle}
            placeholder="Phone Number"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="whatsapp"
            value={form.whatsapp || ""}
            onChange={handle}
            placeholder="WhatsApp Number"
            className="border p-2 rounded w-full"
          />

          {/* Country Dropdown */}
          <select
            name="country"
            value={form.country || ""}
            onChange={handle}
            className="border p-2 rounded w-full"
            required
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
            value={form.state || ""}
            onChange={handle}
            className="border p-2 rounded w-full"
            disabled={!form.country}
            required
          >
            <option value="">Select State</option>
            {form.country &&
              State.getStatesOfCountry(form.country).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
          </select>

          <input
            name="district"
            value={form.district || ""}
            onChange={handle}
            placeholder="District"
            className="border p-2 rounded w-full"
          />
          <input
            name="city"
            value={form.city || ""}
            onChange={handle}
            placeholder="City / Village"
            className="border p-2 rounded w-full"
          />
          <input
            name="blood_group"
            value={form.blood_group || ""}
            onChange={handle}
            placeholder="Blood Group"
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

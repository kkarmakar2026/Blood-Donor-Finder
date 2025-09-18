
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { Footer } from "../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Drag state
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
        availability: data.availability ?? true,
      });
    })();
  }, [token, navigate]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  // ✅ Drag Handlers
  const startDrag = (e) => {
    if (modalRef.current && e.target.classList.contains("drag-handle")) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };
  const onDrag = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };
  const stopDrag = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    } else {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const countryName = user.country
    ? Country.getCountryByCode(user.country)?.name || user.country
    : "";
  const stateName =
    user.state && user.country
      ? State.getStateByCodeAndCountry(user.state, user.country)?.name ||
        user.state
      : "";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

          {success && <p className="text-green-600 text-center mb-4">{success}</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {/* Profile Details */}
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
                <td className="border px-4 py-2">{countryName}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">State</td>
                <td className="border px-4 py-2">{stateName}</td>
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
              <tr>
                <td className="border px-4 py-2 font-semibold">Availability</td>
                <td className="border px-4 py-2">
                  {user.availability ? "Available" : "Not Available"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setEditing(true);
                setPosition({ x: 0, y: 0 });
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Footer fixed at bottom */}
      <Footer />

      {/* ✅ Popup Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow-md w-1/2 relative"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: dragging ? "grabbing" : "default",
            }}
          >
            <div
              className="flex justify-between items-center drag-handle cursor-move mb-4"
              onMouseDown={startDrag}
            >
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button
                className="text-gray-500 hover:text-red-600 font-bold text-xl"
                onClick={() => setEditing(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitUpdate} className="grid grid-cols-2 gap-3">
              <input
                name="full_name"
                value={form.full_name || ""}
                onChange={handle}
                placeholder="Full Name"
                className="border p-2 rounded"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handle}
                placeholder="Email"
                className="border p-2 rounded"
                required
              />
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handle}
                placeholder="Phone Number"
                className="border p-2 rounded"
                required
              />
              <input
                name="whatsapp"
                value={form.whatsapp || ""}
                onChange={handle}
                placeholder="WhatsApp Number"
                className="border p-2 rounded"
              />

              {/* Country Dropdown */}
              <select
                name="country"
                value={form.country || ""}
                onChange={handle}
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

              {/* State Dropdown */}
              <select
                name="state"
                value={form.state || ""}
                onChange={handle}
                className="border p-2 rounded"
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
                className="border p-2 rounded"
              />
              <input
                name="city"
                value={form.city || ""}
                onChange={handle}
                placeholder="City / Village"
                className="border p-2 rounded"
              />
              <input
                name="blood_group"
                value={form.blood_group || ""}
                onChange={handle}
                placeholder="Blood Group"
                className="border p-2 rounded"
                required
              />

              {/* Availability Dropdown */}
              <select
                name="availability"
                value={form.availability ? "Available" : "Not Available"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    availability: e.target.value === "Available",
                  })
                }
                className="border p-2 rounded"
                required
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>

              <div className="col-span-2 flex gap-4 mt-4 justify-start">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

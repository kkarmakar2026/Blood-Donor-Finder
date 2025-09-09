import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    blood_group: "",
    availability: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Basic frontend validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.full_name.trim()) return "Full name is required";
    if (!emailRegex.test(form.email)) return "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) return "Enter a valid 10-digit phone number";
    if (!form.city.trim()) return "City is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (!form.blood_group) return "Please select a blood group";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registered successfully!");
        setForm({
          full_name: "",
          email: "",
          phone: "",
          city: "",
          password: "",
          blood_group: "",
          availability: true,
        });

        // Redirect after short delay (2s)
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.error || "❌ Registration failed");
      }
    } catch (err) {
      setError("❌ Server error, please try again later");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      {/* Messages */}
      {error && <p className="text-red-600 text-center mb-3">{error}</p>}
      {message && <p className="text-green-600 text-center mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available to donate
        </label>

        <button
          type="submit"
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

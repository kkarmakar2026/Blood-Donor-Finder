import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

const Register = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    country: "",
    state: "",
    district: "",
    city: "",
    phone: "",
    whatsapp: "",
    password: "",
    confirm_password: "",
    blood_group: "",
    availability: true,
    authorise: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (form.country) {
      const countryStates = State.getStatesOfCountry(form.country);
      setStates(countryStates);
      setForm((prev) => ({ ...prev, state: "" }));
    }
  }, [form.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+\d{1,4}\s?\d{6,14}$/; // e.g. +91 9090909090

    if (!form.full_name.trim()) return "Full name is required";
    if (!emailRegex.test(form.email)) return "Enter a valid email";
    if (!phoneRegex.test(form.phone))
      return "Enter phone in format +91 9090909090";
    if (form.whatsapp && !phoneRegex.test(form.whatsapp))
      return "Enter WhatsApp number in format +91 9090909090 (or leave blank)";
    if (!form.country) return "Please select a country";
    if (!form.state) return "Please select a state";
    if (!form.district.trim()) return "Please enter your district";
    if (!form.city.trim()) return "Please enter your city/village";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (form.password !== form.confirm_password)
      return "Passwords do not match";
    if (!form.blood_group) return "Please select a blood group";
    if (!form.authorise)
      return "You must authorise to display your details";
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
          country: "",
          state: "",
          district: "",
          city: "",
          phone: "",
          whatsapp: "",
          password: "",
          confirm_password: "",
          blood_group: "",
          availability: true,
          authorise: false,
        });

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
    <div className="max-w-md mx-auto p-6 border rounded shadow bg-white">
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
          placeholder="Email (Used as User ID)"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
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
          className="border p-2 rounded"
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
          placeholder="District"
          value={form.district}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* City/Village */}
        <input
          type="text"
          name="city"
          placeholder="City / Village"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number (e.g. +91 9090909090)"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* WhatsApp (Optional) */}
        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number (Optional)"
          value={form.whatsapp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        {form.confirm_password &&
          form.password !== form.confirm_password && (
            <p className="text-red-600 text-sm">Passwords do not match</p>
          )}
        {form.confirm_password &&
          form.password === form.confirm_password && (
            <p className="text-green-600 text-sm">Passwords match ✅</p>
          )}

        {/* Blood Group */}
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available to donate
        </label>

        {/* Authorisation */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="authorise"
            checked={form.authorise}
            onChange={handleChange}
          />
          I authorise this website to display my name and telephone/WhatsApp
          number, so that the needy could contact me, as and when there is an
          emergency
        </label>

        <button
          type="submit"
          disabled={!form.authorise}
          className={`${
            form.authorise
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white py-2 rounded transition`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";

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

  return (
    <div className="bg-red-600 text-white p-10 md:p-32 rounded-lg flex flex-col md:flex-row items-center">
      {/* Form Section */}
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-bold mb-4">FIND BLOOD DONORS</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-6">
          {/* Blood Group */}
          <select
            name="blood_group"
            value={form.blood_group}
            onChange={handleChange}
            className="p-2 rounded text-black"
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
            className="p-2 rounded text-black"
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
            className="p-2 rounded text-black"
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
            className="p-2 rounded text-black"
            required
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="Enter City/Village"
            value={form.city}
            onChange={handleChange}
            className="p-2 rounded text-black"
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

        {/* Donors Table */}
        {donors.length > 0 && (
          <table className="min-w-full bg-white text-black rounded shadow">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Blood Group</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">WhatsApp</th>
                <th className="py-2 px-4">District</th>
                <th className="py-2 px-4">City</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d.user_id} className="border-b">
                  <td className="py-2 px-4">{d.full_name}</td>
                  <td className="py-2 px-4">{d.blood_group}</td>
                  <td className="py-2 px-4">{d.phone}</td>
                  <td className="py-2 px-4">{d.whatsapp || "-"}</td>
                  <td className="py-2 px-4">{d.district}</td>
                  <td className="py-2 px-4">{d.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FindDonorForm;

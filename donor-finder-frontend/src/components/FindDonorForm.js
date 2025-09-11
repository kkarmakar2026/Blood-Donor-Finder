import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";

const FindDonorForm = () => {
  const [form, setForm] = useState({
    bloodGroup: "",
    country: "", // Default India (ISO Code)
    state: "",
    city: "", // Now will be typed manually
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  // Load all countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // When country changes → load states
  useEffect(() => {
    if (form.country) {
      setStates(State.getStatesOfCountry(form.country));
      setForm((prev) => ({ ...prev, state: "", city: "" }));
    }
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Searching donors for ${form.bloodGroup} in ${form.city}, ${form.state}, ${form.country}`
    );
  };

  return (
    <div className="bg-red-600 text-white p-10 md:p-32 rounded-lg flex flex-col md:flex-row items-center">
      {/* Form Section */}
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-bold mb-4">FIND BLOOD DONORS</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          {/* Blood Group */}
          <select
            name="bloodGroup"
            value={form.bloodGroup}
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
            <option value="">--Select Country--</option>
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
            <option value="">--Select State--</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>

          {/* City (manual input instead of dropdown) */}
          <input
            type="text"
            name="city"
            placeholder="Enter your city/village"
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
            SEARCH
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindDonorForm;

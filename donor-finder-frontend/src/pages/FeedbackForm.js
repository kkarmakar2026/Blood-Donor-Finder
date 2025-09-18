// src/pages/FeedbackForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    feedback: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.mobile || !form.feedback) {
      setMessage("⚠️ Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Thank you for your feedback!");
        setMessageType("success");
        setForm({ name: "", email: "", mobile: "", feedback: "" });

        // Hide message after 5s and redirect to home
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 5000);
      } else {
        setMessage("❌ Failed to submit feedback. Try again later.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setMessage("❌ Error submitting feedback. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">
          Feedback
        </h2>

        {/* Intro Message */}
        <p className="text-red-600 text-lg font-medium mb-4 text-center">
        Your feedback matters! Share your suggestions to make our community
          better and stronger.
        </p>

        {/* Success / Error Messages */}
        {message && (
          <p
            className={`mb-4 text-center text-sm font-medium ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Feedback / Suggestions
            </label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              rows="4"
              className="w-full border p-2 rounded"
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

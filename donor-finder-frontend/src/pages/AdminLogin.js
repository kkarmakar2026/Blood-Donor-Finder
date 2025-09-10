import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSessionExpired("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Save token
        localStorage.setItem("adminToken", data.token);

        // ✅ Auto logout after 10 minutes (600,000 ms)
        setTimeout(() => {
          localStorage.removeItem("adminToken");
          alert("Session expired. Please log in again.");
          navigate("/admin/login");
        }, 600000);

        // ✅ Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-6 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        {/* ✅ Error Message */}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        {/* ✅ Session Expired Message */}
        {sessionExpired && (
          <p className="text-orange-600 text-center mb-2">{sessionExpired}</p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;



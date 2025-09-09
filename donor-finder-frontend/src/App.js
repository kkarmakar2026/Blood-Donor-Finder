import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Donors from "./pages/Donors";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";       // ✅ Import AdminLogin
import AdminDashboard from "./pages/AdminDashboard."; // ✅ Import Dashboard

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* ✅ Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

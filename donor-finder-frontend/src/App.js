// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Donors from "./pages/Donors";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";   // ✅ Import Profile page
import  Faqs from "./pages/FAQs";
import Feedback from "./pages/FeedbackForm"
import FAQs from "./pages/FAQs";
import FeedbackForm from "./pages/FeedbackForm";
import AdminReports from "./pages/AdminReport";
import AdminFeedbackReview from "./pages/AdminFeedbackReview";
import ResolvedReport from "./pages/ResolvedReport";
import AdminReportPreview from "./pages/AdminReportPreview";


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
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/faqs" element={<FAQs/>} />
        <Route path="/feedback" element={<FeedbackForm/>} />
        <Route path="/admin/feedback" element={<AdminReports />} />
        <Route path="/admin/feedback-review" element={<AdminFeedbackReview />} />
        <Route path="/admin/resolved-reports" element={<ResolvedReport />} />
        <Route path="/admin/reports" element={<AdminReportPreview />} />


        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

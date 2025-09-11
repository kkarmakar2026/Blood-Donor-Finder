// import React, { useState, useEffect } from "react";

// export default function Profile() {
//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     city: "",
//     blood_group: "",
//   });
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Load current user details from localStorage
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//       setForm({
//         full_name: user.full_name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         city: user.city || "",
//         blood_group: user.blood_group || "",
//       });
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     const res = await fetch(`http://localhost:5000/api/users/${user.user_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setMessage("Profile updated successfully!");
//       localStorage.setItem("user", JSON.stringify(data.user));
//     } else {
//       setMessage(data.error || "Update failed");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 border rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
//       {message && <p className="mb-2 text-red-600">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />
//         <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
//         <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
//         <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" />
//         <select name="blood_group" value={form.blood_group} onChange={handleChange} className="w-full border p-2 rounded">
//           <option value="">Select Blood Group</option>
//           <option value="A+">A+</option><option value="A-">A-</option>
//           <option value="B+">B+</option><option value="B-">B-</option>
//           <option value="AB+">AB+</option><option value="AB-">AB-</option>
//           <option value="O+">O+</option><option value="O-">O-</option>
//         </select>
//         <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Update</button>
//       </form>
//     </div>
//   );
// }





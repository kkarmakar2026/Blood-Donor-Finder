import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    blood_group: "",
  });

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setForm({ full_name: "", email: "", phone: "", city: "", password: "", blood_group: "" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add User Form */}
      <form onSubmit={addUser} className="mb-6 flex flex-wrap gap-2">
        <input type="text" name="full_name" placeholder="Name" value={form.full_name} onChange={handleChange} className="border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded" required />
        <select name="blood_group" value={form.blood_group} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Blood Group</option>
          <option value="A+">A+</option><option value="A-">A-</option>
          <option value="B+">B+</option><option value="B-">B-</option>
          <option value="AB+">AB+</option><option value="AB-">AB-</option>
          <option value="O+">O+</option><option value="O-">O-</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add User</button>
      </form>

      {/* Users Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-red-500 ">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Blood Group</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td className="border p-2">{u.full_name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.phone}</td>
              <td className="border p-2">{u.city}</td>
              <td className="border p-2">{u.blood_group}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteUser(u.user_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

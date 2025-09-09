import React, { useState } from "react";

export default function CommentSection() {
  const [comments, setComments] = useState([
    { id: 1, name: "Koushik", message: "Great initiative!" },
    { id: 2, name: "Sneha", message: "Helpful platform for emergencies." },
  ]);
  const [form, setForm] = useState({ name: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setComments([{ id: Date.now(), ...form }, ...comments]);
    setForm({ name: "", message: "" });
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          placeholder="Your Comment"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border rounded-lg p-2"
          required
        />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Post Comment
        </button>
      </form>
      <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border rounded-lg p-3">
            <p className="font-semibold">{c.name}</p>
            <p className="text-gray-700">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

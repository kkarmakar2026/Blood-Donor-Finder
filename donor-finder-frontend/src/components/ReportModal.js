// import React, { useRef, useState, useEffect } from "react";

// const ReportModal = ({ donor, show, onClose, onSubmit, form, setForm }) => {
//   const modalRef = useRef(null);
//   const [dragging, setDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   // Drag handlers
//   const startDrag = (e) => {
//     if (modalRef.current && e.target.classList.contains("drag-handle")) {
//       setDragging(true);
//       setOffset({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y,
//       });
//     }
//   };

//   const onDrag = (e) => {
//     if (dragging) {
//       setPosition({
//         x: e.clientX - offset.x,
//         y: e.clientY - offset.y,
//       });
//     }
//   };

//   const stopDrag = () => setDragging(false);

//   useEffect(() => {
//     if (dragging) {
//       document.addEventListener("mousemove", onDrag);
//       document.addEventListener("mouseup", stopDrag);
//     } else {
//       document.removeEventListener("mousemove", onDrag);
//       document.removeEventListener("mouseup", stopDrag);
//     }
//     return () => {
//       document.removeEventListener("mousemove", onDrag);
//       document.removeEventListener("mouseup", stopDrag);
//     };
//   }, [dragging]);

//   if (!show || !donor) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-lg w-96 relative"
//         style={{
//           transform: `translate(${position.x}px, ${position.y}px)`,
//           cursor: dragging ? "grabbing" : "default",
//         }}
//       >
//         {/* Drag Header */}
//         <div
//           className="drag-handle cursor-move bg-gray-200 p-2 rounded-t-lg font-semibold flex justify-between items-center"
//           onMouseDown={startDrag}
//         >
//           <span>Report Donor</span>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-black font-bold"
//           >
//             ✖
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6 overflow-y-auto max-h-[80vh]">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               onSubmit(form, donor); // ✅ pass form and donor to the parent
//             }}
//             className="space-y-3"
//           >
//             <div>
//               <label className="block text-sm font-semibold">Full Name:</label>
//               <p className="text-gray-800">{donor.full_name}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold">Report Against:</label>
//               <select
//                 name="reason"
//                 value={form.reason}
//                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select reason</option>
//                 <option value="wrong number">Wrong Number</option>
//                 <option value="phone no using someone else">Phone No Using Someone Else</option>
//                 <option value="donors location changed">Donor's Location Changed</option>
//                 <option value="donated recently">Donated Recently</option>
//                 <option value="can't donate anymore">Can't Donate Anymore</option>
//                 <option value="denied to donate">Denied to Donate</option>
//                 <option value="denied to donate">Wrong Blood Group</option>
//                 <option value="spam">Report As Spam</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold">Report Description:</label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 rows="3"
//                 className="w-full p-2 border rounded"
//                 placeholder="Enter details..."
//               ></textarea>
//             </div>

//             <button
//               type="submit"
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//             >
//               Submit Report
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportModal;




import React, { useRef, useState, useEffect } from "react";

const ReportModal = ({ donor, show, onClose, form, setForm }) => {
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag handlers
  const startDrag = (e) => {
    if (modalRef.current && e.target.classList.contains("drag-handle")) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const onDrag = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const stopDrag = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    } else {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  if (!show || !donor) return null;

  // ✅ Local submit handler with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/report-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_id: donor.user_id,
          reason: form.reason,
          description: form.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Report submitted successfully");
        onClose();
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Report submit error:", err);
      alert("❌ Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-96 relative"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* Drag Header */}
        <div
          className="drag-handle cursor-move bg-gray-200 p-2 rounded-t-lg font-semibold flex justify-between items-center"
          onMouseDown={startDrag}
        >
          <span>Report Donor</span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-bold"
          >
            ✖
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold">Full Name:</label>
              <p className="text-gray-800">{donor.full_name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Report Against:
              </label>
              <select
                name="reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select reason</option>
                <option value="wrong number">Wrong Number</option>
                <option value="phone no using someone else">
                  Phone No Using Someone Else
                </option>
                <option value="donors location changed">
                  Donor's Location Changed
                </option>
                <option value="donated recently">Donated Recently</option>
                <option value="can't donate anymore">Can't Donate Anymore</option>
                <option value="denied to donate">Denied to Donate</option>
                <option value="wrong blood group">Wrong Blood Group</option>
                <option value="spam">Report As Spam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Report Description:
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Enter details..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

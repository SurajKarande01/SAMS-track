import { useState } from "react";
import FacultyMenu from "./FacultyMenu";

function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    fetch("http://localhost:8091/student/add-student/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Student added successfully!");
          setName("");
          setEmail("");
        } else {
          setMessage("Failed to add student.");
        }
      })
      .catch(() => setMessage("Something went wrong."));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FacultyMenu />

      <div className="flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Add Student</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center mb-3 ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Save Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

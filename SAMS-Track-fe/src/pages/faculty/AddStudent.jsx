import { useState } from "react";
import FacultyMenu from "../../components/FacultyMenu";
import { studentService } from "../../services/studentService";

function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await studentService.add({ name, email });
      setMessage("Student added successfully!");
      setName("");
      setEmail("");
    } catch (err) {
      setMessage("Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-md border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add Student</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center mb-3 ${
                message.includes("successfully") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyMenu from "../../components/FacultyMenu";
import { studentService } from "../../services/studentService";

function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    contactNo: "",
    parentNo: "",
    password: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await studentService.add(form);
      setMessage("Student added successfully!");
      setForm({
        username: "",
        name: "",
        email: "",
        contactNo: "",
        parentNo: "",
        password: "",
        address: "",
      });
      setTimeout(() => {
        navigate("/faculty-dashboard");
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === "string") {
        setMessage(err.response.data);
      } else {
        setMessage("Failed to add student.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex flex-col">
      <FacultyMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg flex flex-col gap-4 border"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700">Add Student</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal Contact Number</label>
            <input
              type="text"
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Parent Contact Number</label>
            <input
              type="text"
              name="parentNo"
              value={form.parentNo}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("successfully") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? "Registering Student..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

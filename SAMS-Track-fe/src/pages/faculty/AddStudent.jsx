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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <FacultyMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded border border-gray-300 shadow-sm w-full max-w-lg flex flex-col gap-4"
        >
          <div className="border-b pb-3 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Register New Student</h2>
            <p className="text-xs text-gray-600">Enter personal and contact information for new enrollment</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Username / Roll No</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Personal Contact No</label>
              <input
                type="text"
                name="contactNo"
                value={form.contactNo}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Parent Contact No</label>
              <input
                type="text"
                name="parentNo"
                value={form.parentNo}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Residential Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            ></textarea>
          </div>

          {message && (
            <div
              className={`text-xs text-center p-2.5 rounded font-semibold border ${
                message.includes("successfully") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white py-2.5 rounded text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? "Registering Student..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;


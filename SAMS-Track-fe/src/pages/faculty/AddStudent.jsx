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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-lg border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add Student</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Personal Contact Number</label>
            <input
              type="text"
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Parent Contact Number</label>
            <input
              type="text"
              name="parentNo"
              value={form.parentNo}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
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
            {loading ? "Registering Student..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

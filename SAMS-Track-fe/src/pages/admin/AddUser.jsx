import { useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";
import { studentService } from "../../services/studentService";

function AddUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    parentNo: "",
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

    if (form.role === "faculty" && !/^\d+$/.test(form.username.trim())) {
      setMessage("Faculty mobile number must contain only numbers.");
      return;
    }
    if (form.role === "student") {
      if (!/^\d+$/.test(form.username.trim())) {
        setMessage("Student mobile number must contain only numbers.");
        return;
      }
      if (!/^\d+$/.test(form.parentNo.trim())) {
        setMessage("Parent mobile number must contain only numbers.");
        return;
      }
    }

    setLoading(true);

    try {
      if (form.role === "student") {
        const studentPayload = {
          name: form.firstName.trim() + (form.lastName ? " " + form.lastName.trim() : ""),
          email: form.email.trim(),
          contactNo: form.username.trim(),
          parentNo: form.parentNo.trim(),
          password: form.password,
          address: form.address.trim(),
          username: form.username.trim(),
        };
        await studentService.add(studentPayload);
        setMessage("Student registered successfully!");
      } else {
        await userService.register(form);
        setMessage("User registered successfully!");
      }
      setForm({
        username: "",
        password: "",
        email: "",
        role: "",
        firstName: "",
        lastName: "",
        parentNo: "",
        address: "",
      });
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === "string") {
        setMessage(err.response.data);
      } else {
        setMessage("Failed to register user.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded border border-gray-300 shadow-sm w-full max-w-lg flex flex-col gap-4"
        >
          <div className="border-b pb-3 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Add New System User</h2>
            <p className="text-xs text-gray-600">Register student, faculty (using mobile number) or admin accounts</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Account Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">
              {form.role === "faculty" || form.role === "student" ? "Mobile Number (Login ID)" : "Login Username / Gmail"}
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder={
                form.role === "faculty" || form.role === "student"
                  ? "10-digit mobile number (e.g. 9876543210)"
                  : "Gmail address for admin (e.g. admin@gmail.com)"
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          {form.role === "student" ? (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Student full name (e.g. Rahul Sharma)"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. user@gmail.com"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          {form.role === "student" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Parent Mobile Number</label>
              <input
                type="text"
                name="parentNo"
                value={form.parentNo}
                onChange={handleChange}
                placeholder="Parent's 10-digit mobile number"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          {form.role === "student" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Residential Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Student residential address"
                rows="2"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          )}

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
            {loading ? "Registering..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;

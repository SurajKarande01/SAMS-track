import { useState } from "react";
import AdminMenu from "./AdminMenu";

function AddUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8091/user/register-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("User registered successfully!");
        setForm({
          username: "",
          password: "",
          email: "",
          role: "",
          firstName: "",
          lastName: "",
        });
      } else {
        setMessage("Failed to register user.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-lg"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Add User</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select role</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
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
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;

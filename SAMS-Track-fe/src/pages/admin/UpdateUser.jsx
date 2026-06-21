import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";

function UpdateUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);

  // fetch user data
  useEffect(() => {
    userService.getByUsername(username)
      .then((data) => setUser(data))
      .catch((err) => console.error("Error:", err));
  }, [username]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    userService.update(user)
      .then(() => {
        alert("User updated!");
        navigate("/all-users");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to update user.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      <AdminMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg flex flex-col gap-4 border"
        >
          <h2 className="text-2xl font-bold text-center text-blue-600">Update User</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
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
              value={user.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;

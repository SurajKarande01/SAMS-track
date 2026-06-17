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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminMenu />

      <div className="flex-grow flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-lg border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Update User</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;

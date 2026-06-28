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
        alert("User updated successfully!");
        navigate("/all-users");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to update user.");
      })
      .finally(() => setLoading(false));
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
            <h2 className="text-xl font-bold text-gray-800">Update User Credentials</h2>
            <p className="text-xs text-gray-600">Modify details for account: {user.username}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Username (Read Only)</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">First Name</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName || ""}
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
                value={user.lastName || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Account Role</label>
            <select
              name="role"
              value={user.role || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
            <input
              type="password"
              name="password"
              value={user.password || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/all-users")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded text-sm font-semibold transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;


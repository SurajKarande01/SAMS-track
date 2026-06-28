import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";

function AllUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (username) => {
    if (!window.confirm(`Delete user: ${username}?`)) return;

    userService.delete(username)
      .then(() => {
        alert("User deleted!");
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to delete user.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="p-6 max-w-5xl mx-auto flex-grow w-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All User Accounts</h1>
            <p className="text-sm text-gray-600">Manage registered faculty and admin credentials</p>
          </div>
          <button
            onClick={() => navigate("/add-user")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition"
          >
            + Add New User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 font-medium">Loading user list...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                  <th className="p-3">Username</th>
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {users.length > 0 ? (
                  users.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{user.username}</td>
                      <td className="p-3 text-gray-700">{user.firstName}</td>
                      <td className="p-3 text-gray-700">{user.lastName}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {user.role || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/update-user/${user.username}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.username)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                      No users registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllUser;


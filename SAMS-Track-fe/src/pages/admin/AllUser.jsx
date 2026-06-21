import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";

function AllUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // fetch all users
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

  // delete user
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      <AdminMenu />

      <div className="p-6 max-w-6xl mx-auto flex-grow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">All Users</h2>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4 border border-gray-300">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">First Name</th>
                  <th className="border px-4 py-2">Last Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.firstName}</td>
                      <td className="border px-4 py-2">{user.lastName}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2 capitalize">{user.role || "N/A"}</td>
                      <td className="border px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/update-user/${user.username}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.username)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500 border">
                      No users found.
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

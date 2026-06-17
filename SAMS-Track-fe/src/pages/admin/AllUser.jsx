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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminMenu />

      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">All Users</h2>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto border rounded border-gray-200 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border-b p-3 text-left">Username</th>
                  <th className="border-b p-3 text-left">First Name</th>
                  <th className="border-b p-3 text-left">Last Name</th>
                  <th className="border-b p-3 text-left">Email</th>
                  <th className="border-b p-3 text-left">Role</th>
                  <th className="border-b p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border-b p-3">{user.username}</td>
                      <td className="border-b p-3">{user.firstName}</td>
                      <td className="border-b p-3">{user.lastName}</td>
                      <td className="border-b p-3">{user.email}</td>
                      <td className="border-b p-3 capitalize">{user.role || "N/A"}</td>
                      <td className="border-b p-3 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/update-user/${user.username}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
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
                    <td colSpan="6" className="text-center p-4 text-gray-500">
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

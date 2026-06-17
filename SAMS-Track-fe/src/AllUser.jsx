import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";

function AllUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // fetch all users
  const fetchUsers = () => {
    fetch("http://localhost:8091/user/get-all-user/")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // delete user
  const deleteUser = (username) => {
    if (!window.confirm(`Delete user: ${username}?`)) return;

    fetch(
      `http://localhost:8091/user/delete-user-by-username?username=${username}`,
      { method: "DELETE" }
    )
      .then((res) => {
        if (res.ok) {
          alert("User deleted!");
          fetchUsers();
        } else {
          alert("Failed to delete user.");
        }
      })
      .catch(() => alert("Error deleting user."));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">All Users</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Username</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.firstName}</td>
                  <td className="border p-2">{user.lastName}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role || "N/A"}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => navigate(`/update-user/${user.username}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.username)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
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
    </div>
  );
}

export default AllUser;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenu from "./AdminMenu";

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

  // fetch user data
  useEffect(() => {
    fetch(`http://localhost:8091/user/get-user-by-username/${username}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error:", err));
  }, [username]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8091/user/update-user/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (res.ok) {
          alert("User updated!");
          navigate("/all-users");
        } else {
          alert("Failed to update user.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-lg"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Update User</h2>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
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
              value={user.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
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
              value={user.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;

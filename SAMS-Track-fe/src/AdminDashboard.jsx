import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Dashboard
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/add-user"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-bold">Add User</h3>
            <p className="text-sm text-gray-500">Create a new user account</p>
          </Link>

          <Link
            to="/all-users"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold">All Users</h3>
            <p className="text-sm text-gray-500">View and manage all users</p>
          </Link>

          <Link
            to="/all-subject"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold">All Subjects</h3>
            <p className="text-sm text-gray-500">
              View and manage all subjects
            </p>
          </Link>

          <Link
            to="/view-attendance"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold">View Attendance</h3>
            <p className="text-sm text-gray-500">Check attendance records</p>
          </Link>

          <Link
            to="/my-profile"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">🧑‍💼</div>
            <h3 className="font-bold">My Profile</h3>
            <p className="text-sm text-gray-500">View your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import { Link } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminMenu />

      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Dashboard
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/add-user"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-bold text-gray-700">Add User</h3>
            <p className="text-sm text-gray-500">Create a new user account</p>
          </Link>

          <Link
            to="/all-users"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-700">All Users</h3>
            <p className="text-sm text-gray-500">View and manage all users</p>
          </Link>

          <Link
            to="/all-subject"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-gray-700">All Subjects</h3>
            <p className="text-sm text-gray-500">
              View and manage all subjects
            </p>
          </Link>

          <Link
            to="/view-attendance"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-700">View Attendance</h3>
            <p className="text-sm text-gray-500">Check attendance records</p>
          </Link>

          <Link
            to="/my-profile"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">🧑‍💼</div>
            <h3 className="font-bold text-gray-700">My Profile</h3>
            <p className="text-sm text-gray-500">View your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import { Link } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="max-w-5xl mx-auto py-10 px-4 flex-grow w-full">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of administrative functions and system management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/add-user"
            className="bg-white rounded border border-gray-300 p-6 flex flex-col items-center text-center hover:border-blue-500 shadow-sm transition"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Add User</h3>
            <p className="text-gray-600 text-xs">Create a new faculty or admin account</p>
          </Link>

          <Link
            to="/all-users"
            className="bg-white rounded border border-gray-300 p-6 flex flex-col items-center text-center hover:border-blue-500 shadow-sm transition"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">All Users</h3>
            <p className="text-gray-600 text-xs">View and manage all registered user accounts</p>
          </Link>

          <Link
            to="/all-subject"
            className="bg-white rounded border border-gray-300 p-6 flex flex-col items-center text-center hover:border-blue-500 shadow-sm transition"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">All Subjects</h3>
            <p className="text-gray-600 text-xs">View and manage subject courses</p>
          </Link>

          <Link
            to="/view-attendance"
            className="bg-white rounded border border-gray-300 p-6 flex flex-col items-center text-center hover:border-blue-500 shadow-sm transition"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">View Attendance</h3>
            <p className="text-gray-600 text-xs">Check system-wide attendance logs</p>
          </Link>

          <Link
            to="/my-profile"
            className="bg-white rounded border border-gray-300 p-6 flex flex-col items-center text-center hover:border-blue-500 shadow-sm transition"
          >
            <div className="text-4xl mb-3">🧑‍💼</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">My Profile</h3>
            <p className="text-gray-600 text-xs">View and update your personal profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


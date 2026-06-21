import { Link } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Admin Functionalities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            to="/add-user"
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">👤</div>
            <h3 className="text-lg font-bold text-blue-600 mb-2">Add User</h3>
            <p className="text-gray-600 text-sm font-normal">Create a new user account</p>
          </Link>

          <Link
            to="/all-users"
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">👥</div>
            <h3 className="text-lg font-bold text-blue-600 mb-2">All Users</h3>
            <p className="text-gray-600 text-sm font-normal">View and manage all users</p>
          </Link>

          <Link
            to="/all-subject"
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📚</div>
            <h3 className="text-lg font-bold text-blue-600 mb-2">All Subjects</h3>
            <p className="text-gray-600 text-sm font-normal">
              View and manage all subjects
            </p>
          </Link>

          <Link
            to="/view-attendance"
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📊</div>
            <h3 className="text-lg font-bold text-blue-600 mb-2">View Attendance</h3>
            <p className="text-gray-600 text-sm font-normal">Check attendance records</p>
          </Link>

          <Link
            to="/my-profile"
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🧑‍💼</div>
            <h3 className="text-lg font-bold text-blue-600 mb-2">My Profile</h3>
            <p className="text-gray-600 text-sm font-normal">View your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

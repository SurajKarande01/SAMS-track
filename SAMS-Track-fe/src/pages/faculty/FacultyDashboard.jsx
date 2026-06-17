import { Link } from "react-router-dom";
import FacultyMenu from "../../components/FacultyMenu";

function FacultyDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyMenu />

      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Faculty Dashboard
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/add-student"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">👨‍🎓</div>
            <h3 className="font-bold text-gray-700">Add Student</h3>
            <p className="text-sm text-gray-500">Add new students</p>
          </Link>

          <Link
            to="/all-students"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-700">All Students</h3>
            <p className="text-sm text-gray-500">View and manage students</p>
          </Link>

          <Link
            to="/mark-attendance"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold text-gray-700">Mark Attendance</h3>
            <p className="text-sm text-gray-500">Mark student attendance</p>
          </Link>

          <Link
            to="/view-attendance"
            className="border border-gray-200 p-6 rounded w-56 text-center bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-700">View Attendance</h3>
            <p className="text-sm text-gray-500">View attendance records</p>
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

export default FacultyDashboard;

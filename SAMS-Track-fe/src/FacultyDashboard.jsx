import { Link } from "react-router-dom";
import FacultyMenu from "./FacultyMenu";

function FacultyDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FacultyMenu />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Faculty Dashboard
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/add-student"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">👨‍🎓</div>
            <h3 className="font-bold">Add Student</h3>
            <p className="text-sm text-gray-500">Add new students</p>
          </Link>

          <Link
            to="/all-students"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold">All Students</h3>
            <p className="text-sm text-gray-500">View and manage students</p>
          </Link>

          <Link
            to="/mark-attendance"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold">Mark Attendance</h3>
            <p className="text-sm text-gray-500">Mark student attendance</p>
          </Link>

          <Link
            to="/view-attendance"
            className="border p-6 rounded w-56 text-center bg-white"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold">View Attendance</h3>
            <p className="text-sm text-gray-500">View attendance records</p>
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

export default FacultyDashboard;

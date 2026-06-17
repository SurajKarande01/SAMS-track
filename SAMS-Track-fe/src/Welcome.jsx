
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen bg-white">
      {/* simple navbar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SAMSTRACK</h1>
        <Link to="/login" className="bg-white text-blue-500 px-4 py-1 rounded">
          Login
        </Link>
      </nav>

      {/* main content */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">
          Student Attendance Management System
        </h2>
        <p className="text-gray-600 mb-10">
          A simple system to manage student attendance
        </p>

        {/* feature cards */}
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="border p-6 rounded w-60 text-center">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold mb-1">Mark Attendance</h3>
            <p className="text-sm text-gray-500">
              Easily mark student attendance for each class.
            </p>
          </div>

          <div className="border p-6 rounded w-60 text-center">
            <div className="text-3xl mb-2">📑</div>
            <h3 className="font-bold mb-1">View Records</h3>
            <p className="text-sm text-gray-500">
              Check attendance history and student records.
            </p>
          </div>

          <div className="border p-6 rounded w-60 text-center">
            <div className="text-3xl mb-2">👨‍🎓</div>
            <h3 className="font-bold mb-1">Manage Students</h3>
            <p className="text-sm text-gray-500">
              Add, edit, or remove student details.
            </p>
          </div>

          <div className="border p-6 rounded w-60 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold mb-1">Reports</h3>
            <p className="text-sm text-gray-500">
              Generate and download attendance reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

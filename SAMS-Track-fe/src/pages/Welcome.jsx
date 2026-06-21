import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex flex-col">
      {/* simple navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md border-b border-blue-700">
        <h1 className="text-xl font-bold">SAMS-TRACK</h1>
        <Link to="/login" className="bg-white text-blue-600 px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition shadow border border-blue-700">
          Login
        </Link>
      </nav>

      {/* main content */}
      <div className="text-center mt-20 flex-grow">
        <h2 className="text-4xl font-bold mb-4 text-blue-700">
          Student Attendance Management System
        </h2>
        <p className="text-gray-700 mb-12 font-medium">
          A simple system to manage student attendance
        </p>

        {/* feature cards */}
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="border border-gray-300 p-6 rounded-xl shadow-lg w-60 text-center bg-white hover:shadow-xl hover:scale-105 transition duration-200">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold mb-2 text-blue-700">Mark Attendance</h3>
            <p className="text-sm text-gray-600">
              Easily mark student attendance for each class.
            </p>
          </div>

          <div className="border border-gray-300 p-6 rounded-xl shadow-lg w-60 text-center bg-white hover:shadow-xl hover:scale-105 transition duration-200">
            <div className="text-4xl mb-3">📑</div>
            <h3 className="font-bold mb-2 text-blue-700">View Records</h3>
            <p className="text-sm text-gray-600">
              Check attendance history and student records.
            </p>
          </div>

          <div className="border border-gray-300 p-6 rounded-xl shadow-lg w-60 text-center bg-white hover:shadow-xl hover:scale-105 transition duration-200">
            <div className="text-4xl mb-3">👨‍🎓</div>
            <h3 className="font-bold mb-2 text-blue-700">Manage Students</h3>
            <p className="text-sm text-gray-600">
              Add, edit, or remove student details.
            </p>
          </div>

          <div className="border border-gray-300 p-6 rounded-xl shadow-lg w-60 text-center bg-white hover:shadow-xl hover:scale-105 transition duration-200">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold mb-2 text-blue-700">Reports</h3>
            <p className="text-sm text-gray-600">
              Generate and download attendance reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

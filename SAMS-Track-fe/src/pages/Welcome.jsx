import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-3.5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wide">SAMS-TRACK</span>
        </div>
        <Link 
          to="/login" 
          className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-1.5 rounded text-sm font-semibold transition border border-gray-200"
        >
          Login
        </Link>
      </nav>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Student Attendance Management System
        </h1>
        <p className="text-gray-600 mb-10 text-base max-w-2xl mx-auto">
          A clean and simple system for schools and colleges to track daily attendance, manage course registries, and view student progress reports.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-white p-6 rounded border border-gray-300 shadow-sm hover:border-blue-400 transition">
            <div className="text-3xl mb-3 text-blue-600">📋</div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">Mark Attendance</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Quickly record daily attendance by subject and class section.
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-gray-300 shadow-sm hover:border-blue-400 transition">
            <div className="text-3xl mb-3 text-blue-600">📑</div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">View Records</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Filter attendance history by date, faculty, and subject.
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-gray-300 shadow-sm hover:border-blue-400 transition">
            <div className="text-3xl mb-3 text-blue-600">👨‍🎓</div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">Manage Students</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Register new student profiles and update contact info.
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-gray-300 shadow-sm hover:border-blue-400 transition">
            <div className="text-3xl mb-3 text-blue-600">📊</div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">Reports & Marks</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Track student exam performance and generate printable reports.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12">
          <Link
            to="/login"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded text-base font-semibold shadow transition"
          >
            Go to Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;


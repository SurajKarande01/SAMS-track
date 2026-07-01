import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FacultyMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/faculty-dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wide">SAMS-TRACK</span>
          <span className="bg-blue-800 text-blue-100 text-[10px] px-2 py-0.5 rounded font-medium border border-blue-600">
            Faculty
          </span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none p-1"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center text-sm font-medium">
          <Link to="/faculty-dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/all-students" className="hover:text-blue-200 transition">
            Students
          </Link>
          <Link to="/mark-attendance" className="hover:text-blue-200 transition">
            Take Attendance
          </Link>
          <Link to="/view-attendance" className="hover:text-blue-200 transition">
            Attendance Logs
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold transition border border-red-700 ml-2 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-850 border-t border-blue-600 px-6 py-4 flex flex-col gap-3 text-sm font-medium absolute left-0 right-0 shadow-lg">
          <Link to="/faculty-dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Dashboard
          </Link>
          <Link to="/all-students" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Students
          </Link>
          <Link to="/mark-attendance" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Take Attendance
          </Link>
          <Link to="/view-attendance" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Attendance Logs
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs font-semibold transition border border-red-700 shadow-sm w-full text-center mt-1"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default FacultyMenu;

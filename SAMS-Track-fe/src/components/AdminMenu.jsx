import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminMenu() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-sm relative z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wide">SAMS-TRACK</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
            role === 'superadmin' ? 'bg-purple-800 text-purple-100 border-purple-600 font-bold' : 'bg-blue-800 text-blue-100 border-blue-600'
          }`}>
            {role === 'superadmin' ? 'Super Admin' : 'Admin'}
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
          <Link to="/admin-dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/all-users" className="hover:text-blue-200 transition">
            User Management
          </Link>
          <Link to="/all-subject" className="hover:text-blue-200 transition">
            Curriculum
          </Link>
          <Link to="/view-attendance" className="hover:text-blue-200 transition">
            Attendance
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
        <div className="md:hidden bg-blue-800 border-t border-blue-600 px-6 py-4 flex flex-col gap-3 text-sm font-medium absolute left-0 right-0 shadow-lg">
          <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Dashboard
          </Link>
          <Link to="/all-users" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            User Management
          </Link>
          <Link to="/all-subject" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Curriculum
          </Link>
          <Link to="/view-attendance" onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition py-1 block">
            Attendance
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

export default AdminMenu;

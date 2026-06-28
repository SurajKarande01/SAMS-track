import { Link, useNavigate } from "react-router-dom";

function AdminMenu() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <nav className="bg-blue-700 text-white px-6 py-3.5 flex items-center justify-between shadow-sm">
      <Link to="/admin-dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-wide">SAMS-TRACK</span>
        <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
          role === 'superadmin' ? 'bg-purple-800 text-purple-100 border-purple-600 font-bold' : 'bg-blue-800 text-blue-100 border-blue-600'
        }`}>
          {role === 'superadmin' ? 'Super Admin' : 'Admin'}
        </span>
      </Link>

      <div className="flex gap-5 items-center">
        <Link to="/admin-dashboard" className="hover:text-blue-200 text-sm font-medium">
          Dashboard
        </Link>
        <Link to="/add-user" className="hover:text-blue-200 text-sm font-medium">
          Add User
        </Link>
        <Link to="/all-users" className="hover:text-blue-200 text-sm font-medium">
          All Users
        </Link>
        <Link to="/all-subject" className="hover:text-blue-200 text-sm font-medium">
          Subjects
        </Link>
        <Link to="/view-attendance" className="hover:text-blue-200 text-sm font-medium">
          Attendance
        </Link>
        <Link to="/my-profile" className="hover:text-blue-200 text-sm font-medium">
          Profile
        </Link>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded text-xs font-semibold transition border border-red-700 ml-2 shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminMenu;

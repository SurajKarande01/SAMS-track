import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

function AdminMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between shadow border-b border-blue-700">
      <Link to="/admin-dashboard" className="flex items-center">
        <Logo showText={true} />
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/admin-dashboard" className="hover:text-blue-200 text-sm font-bold">
          Dashboard
        </Link>
        <Link to="/add-user" className="hover:text-blue-200 text-sm font-bold">
          Add User
        </Link>
        <Link to="/all-users" className="hover:text-blue-200 text-sm font-bold">
          All Users
        </Link>
        <Link to="/all-subject" className="hover:text-blue-200 text-sm font-bold">
          Subjects
        </Link>
        <Link to="/view-attendance" className="hover:text-blue-200 text-sm font-bold">
          Attendance
        </Link>
        <Link to="/my-profile" className="hover:text-blue-200 text-sm font-bold">
          Profile
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded font-bold text-sm transition border border-red-600 shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminMenu;

import { Link, useNavigate } from "react-router-dom";

function AdminMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 text-white p-3 flex items-center justify-between shadow-sm">
      <Link to="/admin-dashboard" className="font-bold text-lg">
        SAMSTRACK
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/admin-dashboard" className="hover:underline text-sm font-medium">
          Dashboard
        </Link>
        <Link to="/add-user" className="hover:underline text-sm font-medium">
          Add User
        </Link>
        <Link to="/all-users" className="hover:underline text-sm font-medium">
          All Users
        </Link>
        <Link to="/all-subject" className="hover:underline text-sm font-medium">
          Subjects
        </Link>
        <Link to="/view-attendance" className="hover:underline text-sm font-medium">
          Attendance
        </Link>
        <Link to="/my-profile" className="hover:underline text-sm font-medium">
          Profile
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminMenu;

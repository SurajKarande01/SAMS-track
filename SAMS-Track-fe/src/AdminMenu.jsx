import { Link, useNavigate } from "react-router-dom";

function AdminMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 text-white p-3 flex items-center justify-between">
      <Link to="/admin-dashboard" className="font-bold text-lg">
        SAMSTRACK
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/admin-dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/add-user" className="hover:underline">
          Add User
        </Link>
        <Link to="/all-users" className="hover:underline">
          All Users
        </Link>
        <Link to="/all-subject" className="hover:underline">
          Subjects
        </Link>
        <Link to="/view-attendance" className="hover:underline">
          Attendance
        </Link>
        <Link to="/my-profile" className="hover:underline">
          Profile
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminMenu;

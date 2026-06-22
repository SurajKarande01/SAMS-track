import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

function FacultyMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between shadow border-b border-blue-700">
      <Link to="/faculty-dashboard" className="flex items-center">
        <Logo showText={true} />
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/faculty-dashboard" className="hover:text-blue-200 text-sm font-bold">
          Dashboard
        </Link>
        <Link to="/add-student" className="hover:text-blue-200 text-sm font-bold">
          Add Student
        </Link>
        <Link to="/all-students" className="hover:text-blue-200 text-sm font-bold">
          All Students
        </Link>
        <Link to="/mark-attendance" className="hover:text-blue-200 text-sm font-bold">
          Mark Attendance
        </Link>
        <Link to="/view-attendance" className="hover:text-blue-200 text-sm font-bold">
          View Attendance
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

export default FacultyMenu;

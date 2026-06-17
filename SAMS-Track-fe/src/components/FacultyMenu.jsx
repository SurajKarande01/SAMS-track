import { Link, useNavigate } from "react-router-dom";

function FacultyMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-green-500 text-white p-3 flex items-center justify-between shadow-sm">
      <Link to="/faculty-dashboard" className="font-bold text-lg">
        SAMSTRACK
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/faculty-dashboard" className="hover:underline text-sm font-medium">
          Dashboard
        </Link>
        <Link to="/add-student" className="hover:underline text-sm font-medium">
          Add Student
        </Link>
        <Link to="/all-students" className="hover:underline text-sm font-medium">
          Students
        </Link>
        <Link to="/mark-attendance" className="hover:underline text-sm font-medium">
          Mark Attendance
        </Link>
        <Link to="/view-attendance" className="hover:underline text-sm font-medium">
          View Attendance
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

export default FacultyMenu;

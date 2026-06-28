import { Link, useNavigate } from "react-router-dom";

function FacultyMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3.5 flex items-center justify-between shadow-sm">
      <Link to="/faculty-dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-wide">SAMS-TRACK</span>
        <span className="bg-blue-800 text-blue-100 text-xs px-2 py-0.5 rounded font-medium border border-blue-600">Faculty</span>
      </Link>

      <div className="flex gap-5 items-center">
        <Link to="/faculty-dashboard" className="hover:text-blue-200 text-sm font-medium">
          Dashboard
        </Link>
        <Link to="/add-student" className="hover:text-blue-200 text-sm font-medium">
          Add Student
        </Link>
        <Link to="/all-students" className="hover:text-blue-200 text-sm font-medium">
          All Students
        </Link>
        <Link to="/mark-attendance" className="hover:text-blue-200 text-sm font-medium">
          Mark Attendance
        </Link>
        <Link to="/view-attendance" className="hover:text-blue-200 text-sm font-medium">
          View Attendance
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

export default FacultyMenu;


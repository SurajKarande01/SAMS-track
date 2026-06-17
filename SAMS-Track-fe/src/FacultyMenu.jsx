import { Link, useNavigate } from "react-router-dom";

function FacultyMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-green-500 text-white p-3 flex items-center justify-between">
      <Link to="/faculty-dashboard" className="font-bold text-lg">
        SAMSTRACK
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/faculty-dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/add-student" className="hover:underline">
          Add Student
        </Link>
        <Link to="/all-students" className="hover:underline">
          Students
        </Link>
        <Link to="/mark-attendance" className="hover:underline">
          Mark Attendance
        </Link>
        <Link to="/view-attendance" className="hover:underline">
          View Attendance
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

export default FacultyMenu;

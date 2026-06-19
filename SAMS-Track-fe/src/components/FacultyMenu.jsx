import { Link, useNavigate } from "react-router-dom";

function FacultyMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-slate-950 text-white px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-900">
      <Link to="/faculty-dashboard" className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        SAMS-TRACK
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/faculty-dashboard" className="hover:text-indigo-200 text-sm font-semibold transition">
          Dashboard
        </Link>
        <Link to="/add-student" className="hover:text-indigo-200 text-sm font-semibold transition">
          Add Students
        </Link>
        <Link to="/my-profile" className="hover:text-indigo-200 text-sm font-semibold transition">
          To Profile
        </Link>
        <button
          onClick={logout}
          className="bg-rose-600 hover:bg-rose-700 px-4 py-1.5 rounded-xl text-sm font-bold transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default FacultyMenu;

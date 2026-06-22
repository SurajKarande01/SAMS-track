import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import Logo from "../components/Logo";

/**
 * Login Component: Dual-mode authentication portal.
 * - User Mode (Student, Parent, Faculty): Logs in using contact numbers only.
 * - Admin Mode: Logs in using Gmail addresses only (@gmail.com).
 */
function Login() {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState("student"); // "student", "parent", "faculty"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * handleLogin: Validates input formatting and performs REST authentication.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedUsername = username.trim();

    // 1. Client-side Form Validation
    if (isAdminMode) {
      if (!trimmedUsername.endsWith("@gmail.com")) {
        setError("Admin login requires a valid Gmail address (ending in @gmail.com).");
        return;
      }
    } else {
      if (!/^\d+$/.test(trimmedUsername)) {
        setError("Contact number must contain only numbers.");
        return;
      }
    }

    setLoading(true);

    try {
      const user = await userService.login(trimmedUsername, password);

      if (user && user.role) {
        // Enforce role consistency on the frontend
        if (isAdminMode && user.role !== "admin") {
          setError("This account does not have Admin privileges.");
          setLoading(false);
          return;
        }
        if (!isAdminMode && user.role !== activeTab) {
          const expectedRole = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
          const actualRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
          setError(`This contact number belongs to a ${actualRole} account. Please select the correct tab.`);
          setLoading(false);
          return;
        }

        // Store session parameters
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        if (user.studentId) {
          localStorage.setItem("studentId", user.studentId.toString());
        }

        // Redirect based on validated role
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "faculty") {
          navigate("/faculty-dashboard");
        } else if (user.role === "student" || user.role === "parent") {
          navigate("/student-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === "string") {
        setError(err.response.data);
      } else {
        setError("Authentication failed. Please verify your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (toAdmin) => {
    setIsAdminMode(toAdmin);
    setUsername("");
    setPassword("");
    setError("");
  };

  // Dynamic classes depending on whether we are in Admin or User mode
  const bgClass = isAdminMode
    ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"
    : "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700";

  const cardClass = isAdminMode
    ? "bg-slate-900/80 border border-slate-700/50 text-white"
    : "bg-white/95 border border-white/20 text-gray-900";

  const labelClass = isAdminMode ? "text-slate-300" : "text-gray-700";

  const inputClass = isAdminMode
    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500"
    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${bgClass}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl backdrop-blur-md p-8 transition-all duration-300 ${cardClass}`}>
        
        {/* Header Logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="w-16 h-16" showText={true} textClass={`text-2xl font-black ${isAdminMode ? "text-white" : "text-blue-600"}`} />
          <p className={`text-xs font-bold tracking-wider uppercase ${isAdminMode ? "text-indigo-400" : "text-gray-500"}`}>
            {isAdminMode ? "Secure Administration" : "Attendance & Marks Portal"}
          </p>
        </div>

        {/* Tab Selectors (Only shown in User Mode) */}
        {!isAdminMode && (
          <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1 mb-6 border border-gray-200">
            {["student", "parent", "faculty"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveTab(role);
                  setError("");
                }}
                className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg capitalize transition-all duration-200 ${
                  activeTab === role
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              {isAdminMode ? "Gmail Address" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Contact Number`}
            </label>
            <input
              type={isAdminMode ? "email" : "text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isAdminMode ? "e.g. admin@gmail.com" : "e.g. 9876543210"}
              className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${inputClass}`}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${inputClass}`}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center bg-red-50 border border-red-200/50 py-2.5 px-3 rounded-lg animate-pulse">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-200 text-sm shadow-lg text-white ${
              isAdminMode
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            } disabled:opacity-50`}
          >
            {loading ? "Authenticating..." : `Log In as ${isAdminMode ? "Admin" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </form>

        {/* Portal Switch Link */}
        <div className="mt-8 border-t pt-4 border-slate-700/20 text-center">
          {isAdminMode ? (
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              ← Back to Student / Parent / Faculty Portal
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Are you an Admin? Access Admin Console →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Login;

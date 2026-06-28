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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedUsername = username.trim();

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
        if (isAdminMode && user.role !== "admin") {
          setError("This account does not have Admin privileges.");
          setLoading(false);
          return;
        }
        if (!isAdminMode && user.role !== activeTab) {
          const actualRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
          setError(`This contact number belongs to a ${actualRole} account. Please select the correct tab.`);
          setLoading(false);
          return;
        }

        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        if (user.studentId) {
          localStorage.setItem("studentId", user.studentId.toString());
        }

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="w-12 h-12" showText={true} textClass="text-2xl font-bold text-blue-700" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isAdminMode ? "Admin Console Login" : "Student / Faculty Login Portal"}
          </p>
        </div>

        {/* Tab Selectors (Only shown in User Mode) */}
        {!isAdminMode && (
          <div className="flex bg-gray-100 p-1 rounded border border-gray-200 gap-1 mb-6">
            {["student", "parent", "faculty"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveTab(role);
                  setError("");
                }}
                className={`flex-1 py-1.5 px-1 text-xs font-semibold rounded capitalize transition ${
                  activeTab === role
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">
              {isAdminMode ? "Gmail Address" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Contact No`}
            </label>
            <input
              type={isAdminMode ? "email" : "text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isAdminMode ? "e.g. admin@gmail.com" : "e.g. 9876543210"}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-2.5 rounded text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded text-sm transition shadow disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in..." : `Login as ${isAdminMode ? "Admin" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </form>

        {/* Portal Switch Link */}
        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          {isAdminMode ? (
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              ← Back to Student / Parent / Faculty Portal
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Are you an Admin? Click here to Login →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Login;


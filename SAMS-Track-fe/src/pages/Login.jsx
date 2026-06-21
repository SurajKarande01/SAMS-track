import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

/**
 * Login Component: Handles user authentication, sets local storage
 * variables on success, and routes users based on their role (admin, faculty, student, parent).
 */
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * handleLogin: Event handler triggered on form submit.
   * Calls the userService API to validate user credentials.
   *
   * @param {Object} e - React form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Perform backend login API request
      const user = await userService.login(username, password);

      if (user && user.role) {
        // Store user metadata in local storage for session management
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        if (user.studentId) {
          localStorage.setItem("studentId", user.studentId.toString());
        }

        // Navigate dynamically based on role type
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
        setError("Invalid username or password");
      }
    } catch (err) {
      // Capture and display API validation errors
      if (err.response && err.response.data && typeof err.response.data === "string") {
        setError(err.response.data);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;

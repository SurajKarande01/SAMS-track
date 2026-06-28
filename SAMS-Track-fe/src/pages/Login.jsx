import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { studentService } from "../services/studentService";
import { passwordResetService } from "../services/passwordResetService";
import Logo from "../components/Logo";

/**
 * Login Component: Dual-mode authentication portal with Mobile-number based login,
 * Student Self-Registration, and Admin-managed Password Reset Requests.
 */
function Login() {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState("student"); // "student", "parent", "faculty"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Student Self-Registration State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    contactNo: "",
    parentNo: "",
    password: "",
    address: "",
  });
  const [regMsg, setRegMsg] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotContact, setForgotContact] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

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
        setError("Mobile / Contact number must contain only numbers.");
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
          setError(`This mobile number belongs to a ${actualRole} account. Please select the correct tab.`);
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

  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setRegMsg("");
    setRegLoading(true);

    try {
      const payload = {
        ...regForm,
        username: regForm.contactNo, // Bind username strictly to mobile number
      };
      await studentService.add(payload);
      setRegMsg("Registration successful! You and your parent can now log in using your mobile numbers and password.");
      setTimeout(() => {
        setShowRegModal(false);
        setRegMsg("");
        setRegForm({
          name: "",
          email: "",
          contactNo: "",
          parentNo: "",
          password: "",
          address: "",
        });
      }, 2500);
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === "string") {
        setRegMsg(err.response.data);
      } else {
        setRegMsg("Registration failed. Please check your inputs.");
      }
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    if (!/^\d+$/.test(forgotContact.trim())) {
      setForgotMsg("Please enter a valid mobile number.");
      return;
    }
    setForgotLoading(true);
    try {
      await passwordResetService.requestReset(forgotContact.trim(), activeTab);
      setForgotMsg("✅ Request submitted! Admin will approve your password reset. Upon approval, your password will be set to your mobile number.");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMsg("");
        setForgotContact("");
      }, 4000);
    } catch (err) {
      setForgotMsg("Failed to submit reset request. Please verify your mobile number.");
    } finally {
      setForgotLoading(false);
    }
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
              {isAdminMode ? "Gmail Address" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Mobile No`}
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
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
              {!isAdminMode && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              )}
            </div>
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

        {/* Student Self-Registration Trigger */}
        {!isAdminMode && (activeTab === "student" || activeTab === "parent") && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowRegModal(true)}
              className="text-xs font-bold text-green-700 hover:underline bg-green-50 px-3 py-1.5 rounded border border-green-200 transition"
            >
              🎓 New Student? Self-Register Profile Here →
            </button>
          </div>
        )}

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

      {/* Student Self-Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowRegModal(false)}>
          <div className="bg-white rounded border border-gray-300 shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Student Self-Registration</h3>
                <p className="text-xs text-gray-500">Register with mobile numbers. Student & Parent share login credentials.</p>
              </div>
              <button onClick={() => setShowRegModal(false)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleStudentRegister} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
                  <input type="text" name="name" value={regForm.name} onChange={handleRegChange} required placeholder="Rahul Sharma" className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
                  <input type="email" name="email" value={regForm.email} onChange={handleRegChange} required placeholder="rahul@example.com" className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Student Mobile No</label>
                  <input type="text" name="contactNo" value={regForm.contactNo} onChange={handleRegChange} placeholder="10-digit number" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Parent Mobile No</label>
                  <input type="text" name="parentNo" value={regForm.parentNo} onChange={handleRegChange} placeholder="10-digit number" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Shared Password</label>
                <input type="password" name="password" value={regForm.password} onChange={handleRegChange} placeholder="••••••••" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Residential Address</label>
                <textarea name="address" value={regForm.address} onChange={handleRegChange} rows="2" required placeholder="Address" className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              {regMsg && (
                <div className={`text-xs text-center p-2 rounded font-semibold border ${regMsg.includes("successful") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {regMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-200">
                <button type="button" onClick={() => setShowRegModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={regLoading} className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded text-xs font-semibold transition shadow-sm disabled:opacity-50">
                  {regLoading ? "Registering..." : "Submit Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Request Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForgotModal(false)}>
          <div className="bg-white rounded border border-gray-300 shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Request Password Reset</h3>
                <p className="text-xs text-gray-500">Request password reset for {activeTab.toUpperCase()}</p>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Registered Mobile Number</label>
                <input
                  type="text"
                  value={forgotContact}
                  onChange={(e) => setForgotContact(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {forgotMsg && (
                <div className={`text-xs text-center p-2.5 rounded font-semibold border ${forgotMsg.includes("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {forgotMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button type="button" onClick={() => setShowForgotModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={forgotLoading} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm disabled:opacity-50">
                  {forgotLoading ? "Submitting..." : "Submit Reset Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

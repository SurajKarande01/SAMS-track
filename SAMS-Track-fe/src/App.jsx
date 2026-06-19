import { Route, Routes } from "react-router-dom";
import "./App.css";

// General Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddUser from "./pages/admin/AddUser";
import AllUser from "./pages/admin/AllUser";
import UpdateUser from "./pages/admin/UpdateUser";
import AllSubject from "./pages/admin/AllSubject";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AddStudent from "./pages/faculty/AddStudent";
import AllStudents from "./pages/faculty/AllStudents";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import ViewAttendance from "./pages/faculty/ViewAttendance";
import StudentDashboard from "./pages/student/StudentDashboard";

// Layout & Protection Components
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-user/:username"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-subject"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllSubject />
              </ProtectedRoute>
            }
          />

          {/* Faculty Protected Routes */}
          <Route
            path="/faculty-dashboard"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-student"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-students"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <AllStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mark-attendance"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/view-attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <ViewAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student", "parent"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "parent"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;


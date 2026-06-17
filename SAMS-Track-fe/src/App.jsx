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

// Layout Components
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/all-users" element={<AllUser />} />
          <Route path="/update-user/:username" element={<UpdateUser />} />
          <Route path="/all-subject" element={<AllSubject />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/all-students" element={<AllStudents />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
          <Route path="/my-profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

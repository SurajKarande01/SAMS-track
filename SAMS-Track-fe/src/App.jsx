import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./Welcome";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AddUser from "./AddUser";
import AllUser from "./AllUser";
import UpdateUser from "./UpdateUser";
import AllSubject from "./AllSubject";
import AddStudent from "./AddStudent";
import AllStudents from "./AllStudents";
import MarkAttendance from "./MarkAttendance";
import ViewAttendance from "./ViewAttendance";
import Profile from "./Profile";
import Footer from "./Footer";

function App() {
  return (
    <>
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
      <Footer />
    </>
  );
}

export default App;

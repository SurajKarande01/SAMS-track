import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";
import { subjectService } from "../../services/subjectService";
import { attendanceService } from "../../services/attendanceService";

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getAll().catch(() => []),
      userService.getAllFaculty().catch(() => []),
      subjectService.getAll().catch(() => []),
      attendanceService.getAllRecords().catch(() => []),
    ]).then(([users, faculties, subjects, attendances]) => {
      setUserCount(users.length || 0);
      setFacultyCount(faculties.length || 0);
      setSubjectCount(subjects.length || 0);
      setAttendanceCount(attendances.length || 0);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="max-w-5xl mx-auto py-10 px-4 flex-grow w-full">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Admin Metrics & Console</h1>
          <p className="text-sm text-gray-600">Real-time institutional oversight and quick administrative controls</p>
        </div>

        {/* Real-time System Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Registered Users</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-blue-700">{loading ? "..." : userCount}</div>
              <p className="text-xs text-gray-500 mt-1">Total platform accounts</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Faculty Members</span>
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-green-700">{loading ? "..." : facultyCount}</div>
              <p className="text-xs text-gray-500 mt-1">Teaching staff members</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Active Subjects</span>
              <span className="text-2xl">📚</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-purple-700">{loading ? "..." : subjectCount}</div>
              <p className="text-xs text-gray-500 mt-1">Course curriculum items</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Attendance Logs</span>
              <span className="text-2xl">📝</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-amber-700">{loading ? "..." : attendanceCount}</div>
              <p className="text-xs text-gray-500 mt-1">Recorded class sessions</p>
            </div>
          </div>
        </div>

        {/* Console Shortcuts */}
        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">System Operations Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-user"
              className="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded text-left transition flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Register Faculty / Admin</h4>
                <p className="text-xs text-gray-500">Create staff credentials</p>
              </div>
            </Link>

            <Link
              to="/all-subject"
              className="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded text-left transition flex items-center gap-3"
            >
              <span className="text-2xl">🛠️</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Configure Subjects</h4>
                <p className="text-xs text-gray-500">Assign faculty to courses</p>
              </div>
            </Link>

            <Link
              to="/view-attendance"
              className="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded text-left transition flex items-center gap-3"
            >
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Audit Attendance Registers</h4>
                <p className="text-xs text-gray-500">Search and verify logs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

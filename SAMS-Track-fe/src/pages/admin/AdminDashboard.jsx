import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";
import { studentService } from "../../services/studentService";
import { subjectService } from "../../services/subjectService";
import { attendanceService } from "../../services/attendanceService";
import { passwordResetService } from "../../services/passwordResetService";
import { adminDeletionService } from "../../services/adminDeletionService";

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [pendingResetRequests, setPendingResetRequests] = useState([]);
  const [pendingAdminDeletionRequests, setPendingAdminDeletionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const currentUserRole = localStorage.getItem("role") || "admin";

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      userService.getAll().catch(() => []),
      studentService.getAll().catch(() => []),
      userService.getAllFaculty().catch(() => []),
      subjectService.getAll().catch(() => []),
      attendanceService.getAllRecords().catch(() => []),
      passwordResetService.getPendingRequests().catch(() => []),
      currentUserRole === "superadmin" ? adminDeletionService.getPendingRequests().catch(() => []) : Promise.resolve([]),
    ]).then(([users, students, faculties, subjects, attendances, resetRequests, adminDeletionReqs]) => {
      setUserCount((users.length || 0) + (students.length || 0));
      setFacultyCount(faculties.length || 0);
      setSubjectCount(subjects.length || 0);
      setAttendanceCount(attendances.length || 0);
      setPendingResetRequests(resetRequests || []);
      setPendingAdminDeletionRequests(adminDeletionReqs || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApproveReset = async (id, contactNo) => {
    if (!window.confirm(`Approve password reset for ${contactNo}? The user's password will be reset to their mobile number.`)) return;
    try {
      await passwordResetService.approveReset(id);
      setActionMsg(`✅ Approved! Password for ${contactNo} has been reset to their mobile number.`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to approve reset request.");
    }
  };

  const handleRejectReset = async (id) => {
    if (!window.confirm("Reject this password reset request?")) return;
    try {
      await passwordResetService.rejectReset(id);
      setActionMsg("Password reset request rejected.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject reset request.");
    }
  };

  const handleGrantAdminDeletion = async (id, targetAdmin) => {
    if (!window.confirm(`[SUPER ADMIN] Grant deletion of Admin account: ${targetAdmin}? The account will be permanently removed.`)) return;
    try {
      await adminDeletionService.grantRequest(id);
      setActionMsg(`🛡️ Granted! Admin account ${targetAdmin} has been permanently deleted.`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to grant admin deletion request.");
    }
  };

  const handleDenyAdminDeletion = async (id) => {
    if (!window.confirm("Deny this admin deletion request?")) return;
    try {
      await adminDeletionService.denyRequest(id);
      setActionMsg("Admin deletion request denied.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to deny request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="max-w-5xl mx-auto py-10 px-4 flex-grow w-full">
        <div className="mb-8 text-center md:text-left flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {currentUserRole === "superadmin" ? "Super Admin Operations Console" : "Admin Metrics & Console"}
            </h1>
            <p className="text-sm text-gray-600">Real-time institutional oversight, security grants, and administrative controls</p>
          </div>
          {currentUserRole === "superadmin" && (
            <span className="bg-purple-800 text-purple-100 px-3 py-1 rounded-full text-xs font-bold uppercase border border-purple-600 shadow-sm">
              👑 Super Admin Elevation Active
            </span>
          )}
        </div>

        {/* Action Alert Notification */}
        {actionMsg && (
          <div className="mb-6 text-xs font-semibold p-3 rounded bg-green-50 text-green-700 border border-green-200 shadow-sm">
            {actionMsg}
          </div>
        )}

        {/* Real-time System Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

        {/* Super Admin Section: Pending Admin Deletion Requests */}
        {currentUserRole === "superadmin" && (
          <div className="bg-white p-6 rounded border border-purple-300 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-700"></div>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <div>
                <h2 className="text-base font-bold text-purple-900 flex items-center gap-2">
                  🛡️ Pending Admin Deletion Requests (Super Admin Authorization)
                </h2>
                <p className="text-xs text-gray-500">Granting permanently deletes the targeted Admin account</p>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded border border-purple-300">
                {pendingAdminDeletionRequests.length} Pending
              </span>
            </div>

            {pendingAdminDeletionRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-purple-50 text-purple-900 text-xs uppercase border-b border-purple-200">
                      <th className="p-3">Target Admin Email</th>
                      <th className="p-3">Requested By (Admin)</th>
                      <th className="p-3">Request Date</th>
                      <th className="p-3 text-center w-52">Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {pendingAdminDeletionRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-purple-50/50">
                        <td className="p-3 font-bold text-red-700">{req.targetAdminUsername}</td>
                        <td className="p-3 text-gray-700 font-medium">{req.requestedByAdmin}</td>
                        <td className="p-3 text-xs text-gray-600">{req.requestDate}</td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => handleGrantAdminDeletion(req.id, req.targetAdminUsername)}
                            className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-xs font-bold shadow-sm transition"
                          >
                            Grant Deletion
                          </button>
                          <button
                            onClick={() => handleDenyAdminDeletion(req.id)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Deny
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-3 text-center">No pending admin deletion authorization requests.</p>
            )}
          </div>
        )}

        {/* Pending Password Reset Requests Console */}
        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-800">Pending Password Reset Requests</h2>
              <p className="text-xs text-gray-500">Approving resets the user password to their mobile number</p>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded border border-amber-300">
              {pendingResetRequests.length} Pending
            </span>
          </div>

          {pendingResetRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Requested Date</th>
                    <th className="p-3 text-center w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {pendingResetRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-800">{req.contactNo}</td>
                      <td className="p-3 capitalize">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200">
                          {req.role}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{req.requestDate}</td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => handleApproveReset(req.id, req.contactNo)}
                          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                        >
                          Approve Reset
                        </button>
                        <button
                          onClick={() => handleRejectReset(req.id)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-3 text-center">No pending password reset requests.</p>
          )}
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

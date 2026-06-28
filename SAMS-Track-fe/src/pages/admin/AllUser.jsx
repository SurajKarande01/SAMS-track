import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";
import { subjectService } from "../../services/subjectService";
import { attendanceService } from "../../services/attendanceService";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "admin", "faculty"
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Activity Monitor Modal states
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll()
      .then((data) => setUsers(data || []))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user: ${username}?`)) return;

    userService.delete(username)
      .then(() => {
        alert("User account deleted successfully!");
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Failed to delete user account.");
      });
  };

  const handleViewActivity = async (user) => {
    setSelectedUserActivity(user);
    setLoadingActivity(true);
    try {
      if (user.role === "faculty") {
        const [subs, atts] = await Promise.all([
          subjectService.getByFaculty(user.username).catch(() => []),
          attendanceService.getAllRecords().catch(() => [])
        ]);
        const facultyAtts = atts.filter(a => a.user && a.user.username === user.username);
        setActivityData({
          assignedSubjects: subs,
          loggedAttendanceCount: facultyAtts.length,
          recentLogs: facultyAtts.slice(0, 5)
        });
      } else {
        setActivityData({
          assignedSubjects: [],
          loggedAttendanceCount: 0,
          recentLogs: []
        });
      }
    } catch (err) {
      console.error("Error fetching activity data:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  // Filter users by selected role
  const filteredUsers = users.filter((u) => {
    if (roleFilter === "admin") return u.role === "admin";
    if (roleFilter === "faculty") return u.role === "faculty";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="p-6 max-w-5xl mx-auto flex-grow w-full">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Registered Accounts</h1>
            <p className="text-sm text-gray-600">Monitor activity, filter roles, and manage system access</p>
          </div>
          <button
            onClick={() => navigate("/add-user")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition"
          >
            + Add New User
          </button>
        </div>

        {/* Sorting / Role Filters */}
        <div className="bg-white p-3 rounded border border-gray-300 shadow-sm mb-6 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase mr-2">Filter by Role:</span>
          {["all", "admin", "faculty"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase transition ${
                roleFilter === r
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r === "all" ? "All Accounts" : r}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 font-medium">Loading user accounts...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                  <th className="p-3">Username</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center w-56">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{user.username}</td>
                      <td className="p-3 text-gray-700">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {user.role || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1.5">
                        <button
                          onClick={() => handleViewActivity(user)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Activity
                        </button>
                        <button
                          onClick={() => navigate(`/update-user/${user.username}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.username)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                      No matching user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Activity Monitor Modal */}
      {selectedUserActivity && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUserActivity(null)}>
          <div className="bg-white rounded border border-gray-300 p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-base">User Activity Monitor</h3>
                <p className="text-xs text-gray-500">{selectedUserActivity.username} ({selectedUserActivity.role?.toUpperCase()})</p>
              </div>
              <button onClick={() => setSelectedUserActivity(null)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            </div>

            {loadingActivity ? (
              <div className="py-6 text-center text-gray-600 text-sm">Fetching operational logs...</div>
            ) : (
              <div className="flex flex-col gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Account Profile Details</p>
                  <p className="font-medium text-gray-800 mt-1">Name: {selectedUserActivity.firstName} {selectedUserActivity.lastName}</p>
                  <p className="text-gray-600 text-xs">Email: {selectedUserActivity.email}</p>
                  <p className="text-gray-600 text-xs">Status: Active Operational Account</p>
                </div>

                {selectedUserActivity.role === "faculty" && activityData && (
                  <>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase mb-1">Assigned Course Subjects ({activityData.assignedSubjects.length})</p>
                      {activityData.assignedSubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {activityData.assignedSubjects.map((s, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded border border-blue-200 font-medium">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No subjects assigned yet.</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase mb-1">Attendance Sessions Taken ({activityData.loggedAttendanceCount})</p>
                      {activityData.recentLogs.length > 0 ? (
                        <ul className="divide-y divide-gray-100 text-xs max-h-40 overflow-y-auto">
                          {activityData.recentLogs.map((log, idx) => (
                            <li key={idx} className="py-1.5 flex justify-between items-center">
                              <span className="font-semibold text-gray-700">{log.subject?.name}</span>
                              <span className="text-gray-500">{log.date} @ {log.time}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500">No attendance records recorded.</p>
                      )}
                    </div>
                  </>
                )}

                {selectedUserActivity.role === "admin" && (
                  <div className="text-xs text-gray-600 bg-purple-50 p-3 rounded border border-purple-200">
                    🛡️ Full Administrative Access. System monitoring, user creation, and subject management privileges active.
                  </div>
                )}
              </div>
            )}
            <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
              <button onClick={() => setSelectedUserActivity(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded text-xs font-semibold">
                Close Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUser;

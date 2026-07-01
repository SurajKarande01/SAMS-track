import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import { userService } from "../../services/userService";
import { studentService } from "../../services/studentService";
import { marksService } from "../../services/marksService";
import { subjectService } from "../../services/subjectService";
import { attendanceService } from "../../services/attendanceService";
import { adminDeletionService } from "../../services/adminDeletionService";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "admin", "faculty", "student", "superadmin"
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const currentUserRole = localStorage.getItem("role") || "admin";
  const currentUsername = localStorage.getItem("username") || "";

  // Activity Monitor Modal states
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Student Edit Modal states
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    id: "",
    name: "",
    email: "",
    contactNo: "",
    parentNo: "",
    password: "",
    address: "",
  });

  const fetchUsers = () => {
    setLoading(true);
    Promise.all([
      userService.getAll().catch(() => []),
      studentService.getAll().catch(() => []),
    ])
      .then(([usersList, studentsList]) => {
        const formattedStudents = (studentsList || []).map((s) => ({
          ...s,
          role: "student",
          username: s.contactNo || s.username || `student-${s.id}`,
        }));
        setUsers([...(usersList || []), ...formattedStudents]);
      })
      .catch((err) => console.error("Error fetching users/students:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (user) => {
    const targetUsername = user.username;
    const targetRole = user.role;

    if (targetRole === "student") {
      if (!window.confirm(`Are you sure you want to permanently delete student profile: ${user.name || targetUsername}?`)) return;
      try {
        await studentService.delete(user.id);
        alert("Student profile deleted successfully.");
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to delete student profile.");
      }
    } else if (targetRole === "admin") {
      if (currentUserRole === "superadmin") {
        if (!window.confirm(`[SUPER ADMIN] Are you sure you want to permanently delete Admin: ${targetUsername}?`)) return;
        try {
          await userService.delete(targetUsername);
          alert("Admin account permanently deleted successfully.");
          fetchUsers();
        } catch (err) {
          console.error(err);
          alert("Failed to delete admin account.");
        }
      } else {
        // Regular Admin attempting to delete another Admin -> requires Super Admin grant!
        if (!window.confirm(`Deleting an Admin account requires Super Admin approval. Submit deletion request for ${targetUsername} to Super Admin?`)) return;
        try {
          await adminDeletionService.requestDeletion(targetUsername, currentUsername);
          alert(`✅ Deletion request for Admin (${targetUsername}) sent to Super Admin for approval!`);
        } catch (err) {
          console.error(err);
          alert("Failed to submit admin deletion request to Super Admin.");
        }
      }
    } else {
      // Regular user or faculty deletion
      if (!window.confirm(`Are you sure you want to permanently delete faculty/user account: ${targetUsername}?`)) return;
      try {
        await userService.delete(targetUsername);
        alert("Account deleted successfully!");
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user account.");
      }
    }
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
      } else if (user.role === "student") {
        const [subs, marks] = await Promise.all([
          studentService.getSubjects(user.id).catch(() => []),
          marksService.getByStudent(user.id).catch(() => [])
        ]);
        setActivityData({
          assignedSubjects: subs || [],
          loggedAttendanceCount: 0,
          recentLogs: marks || []
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

  // Filter users by selected role with Privacy Masking for Super Admin data
  const filteredUsers = users.filter((u) => {
    // Privacy Masking: Hide Super Admin account details from non-superadmins
    if (currentUserRole !== "superadmin" && u.role === "superadmin") {
      return false;
    }
    if (roleFilter === "admin") return u.role === "admin";
    if (roleFilter === "faculty") return u.role === "faculty";
    if (roleFilter === "student") return u.role === "student";
    if (roleFilter === "superadmin") return u.role === "superadmin";
    return true;
  });

  const availableRoles = currentUserRole === "superadmin" 
    ? ["all", "admin", "faculty", "student", "superadmin"] 
    : ["all", "admin", "faculty", "student"];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="p-6 max-w-5xl mx-auto flex-grow w-full">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management Portal</h1>
            <p className="text-sm text-gray-600">Monitor activity, manage roles, and enforce institutional privileges</p>
          </div>
          <button
            onClick={() => navigate("/add-user")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition"
          >
            + Add New User
          </button>
        </div>

        {/* Sorting / Role Filters */}
        <div className="bg-white p-3 rounded border border-gray-300 shadow-sm mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 uppercase mr-2">Filter by Role:</span>
          {availableRoles.map((r) => (
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
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                    <th className="p-3">Mobile / Login ID</th>
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
                        <td className="p-3 text-gray-700">
                          {user.role === "student" 
                            ? (user.name || user.username) 
                            : (`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username)
                          }
                        </td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${
                            user.role === 'superadmin' ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold' :
                            user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            user.role === 'student' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
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
                            onClick={() => {
                              if (user.role === "student") {
                                setEditingStudent(user);
                                setStudentForm({
                                  id: user.id || "",
                                  name: user.name || "",
                                  email: user.email || "",
                                  contactNo: user.contactNo || "",
                                  parentNo: user.parentNo || "",
                                  password: user.password || "",
                                  address: user.address || "",
                                });
                              } else {
                                navigate(`/update-user/${user.username}`);
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user)}
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
                        No matching accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-300 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {user.role === "student" 
                            ? (user.name || user.username) 
                            : (`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username)
                          }
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{user.username}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                        user.role === 'superadmin' ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold' :
                        user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        user.role === 'student' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.role || "N/A"}
                      </span>
                    </div>
                    {user.email && (
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-500">Email:</span> {user.email}
                      </div>
                    )}
                    <div className="flex gap-2 mt-1 border-t pt-3 border-gray-100 justify-end">
                      <button
                        onClick={() => handleViewActivity(user)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex-1 transition text-center"
                      >
                        Activity
                      </button>
                      <button
                        onClick={() => {
                          if (user.role === "student") {
                            setEditingStudent(user);
                            setStudentForm({
                              id: user.id || "",
                              name: user.name || "",
                              email: user.email || "",
                              contactNo: user.contactNo || "",
                              parentNo: user.parentNo || "",
                              password: user.password || "",
                              address: user.address || "",
                            });
                          } else {
                            navigate(`/update-user/${user.username}`);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex-1 transition text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex-1 transition text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded border border-gray-300 text-gray-500 text-sm shadow-sm">
                  No matching accounts found.
                </div>
              )}
            </div>
          </>
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
                  <p className="font-medium text-gray-800 mt-1">
                    Name: {selectedUserActivity.role === "student" 
                      ? selectedUserActivity.name 
                      : `${selectedUserActivity.firstName || ''} ${selectedUserActivity.lastName || ''}`.trim() || selectedUserActivity.username
                    }
                  </p>
                  <p className="text-gray-600 text-xs">Email: {selectedUserActivity.email}</p>
                  {selectedUserActivity.role === "student" && (
                    <>
                      <p className="text-gray-600 text-xs">Student Contact: {selectedUserActivity.contactNo}</p>
                      <p className="text-gray-600 text-xs">Parent Contact: {selectedUserActivity.parentNo}</p>
                      <p className="text-gray-600 text-xs">Address: {selectedUserActivity.address}</p>
                    </>
                  )}
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

                {selectedUserActivity.role === "student" && activityData && (
                  <>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase mb-1">Enrolled Subjects ({activityData.assignedSubjects.length})</p>
                      {activityData.assignedSubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {activityData.assignedSubjects.map((s, idx) => (
                            <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded border border-green-200 font-medium">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Not enrolled in any subjects.</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase mb-1">Academic Marks / Grades ({activityData.recentLogs.length})</p>
                      {activityData.recentLogs.length > 0 ? (
                        <ul className="divide-y divide-gray-100 text-xs max-h-40 overflow-y-auto">
                          {activityData.recentLogs.map((log, idx) => (
                            <li key={idx} className="py-1.5 flex justify-between items-center">
                              <span className="font-semibold text-gray-700">{log.subject?.name || "Subject"} ({log.term})</span>
                              <span className="text-blue-700 font-bold">{log.marks} / 100</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500">No marks recorded yet.</p>
                      )}
                    </div>
                  </>
                )}

                {(selectedUserActivity.role === "admin" || selectedUserActivity.role === "superadmin") && (
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

      {/* Student Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditingStudent(null)}>
          <div className="bg-white rounded border border-gray-300 shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Edit Student Profile</h3>
                <p className="text-xs text-gray-500">Modify details for student: {editingStudent.name}</p>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await studentService.update(studentForm);
                  alert("Student profile updated successfully!");
                  setEditingStudent(null);
                  fetchUsers();
                } catch (err) {
                  console.error(err);
                  alert("Failed to update student profile.");
                }
              }}
              className="flex flex-col gap-3"
            >
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Student Mobile No</label>
                  <input
                    type="text"
                    value={studentForm.contactNo}
                    disabled
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase">Parent Mobile No</label>
                  <input
                    type="text"
                    value={studentForm.parentNo}
                    onChange={(e) => setStudentForm({ ...studentForm, parentNo: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
                <input
                  type="password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  rows="2"
                  required
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-xs font-semibold transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUser;

import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import FacultyMenu from "../../components/FacultyMenu";
import { userService } from "../../services/userService";
import { subjectService } from "../../services/subjectService";
import { attendanceService } from "../../services/attendanceService";

function ViewAttendance() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(role === "faculty" ? (username || "") : "");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalStudents, setModalStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (role === "admin" || role === "superadmin") {
      userService.getAllFaculty()
        .then((data) => setFaculties(data))
        .catch((err) => console.error(err));

      subjectService.getAll()
        .then((data) => setSubjects(data))
        .catch((err) => console.error(err));

      attendanceService.getAllRecords()
        .then((data) => setAttendance(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      subjectService.getByFaculty(username)
        .then((data) => setSubjects(data))
        .catch((err) => console.error(err));

      attendanceService.getAllRecords()
        .then((data) => {
          const facultyLogs = (data || []).filter(a => a.user && a.user.username === username);
          setAttendance(facultyLogs);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [role, username]);

  const showAll = () => {
    setLoading(true);
    attendanceService.getAllRecords()
      .then((data) => {
        if (role === "faculty") {
          setAttendance((data || []).filter(a => a.user && a.user.username === username));
        } else {
          setAttendance(data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const showFiltered = () => {
    if (!selectedFaculty || !selectedSubject || !selectedDate) {
      alert("Please select all filters!");
      return;
    }
    setLoading(true);
    attendanceService.getFiltered(selectedFaculty, selectedSubject, selectedDate)
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const showStudents = (students) => {
    setModalStudents(Array.isArray(students) ? students : []);
    setShowModal(true);
  };

  const handleDeleteAttendance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record log?")) return;
    try {
      await attendanceService.delete(id);
      alert("Attendance record deleted successfully!");
      if (selectedFaculty && selectedSubject && selectedDate) {
        showFiltered();
      } else {
        showAll();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="p-6 max-w-5xl mx-auto flex-grow w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">View Attendance Records</h1>
          <p className="text-sm text-gray-600">Search and verify logged student attendance entries</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-wrap gap-4 mb-6 items-end">
          {role === "admin" && (
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-xs font-semibold uppercase text-gray-700 mb-1">Faculty</label>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select Faculty</option>
                {faculties.map((f, i) => (<option key={i} value={f.username}>{f.firstName} {f.lastName}</option>))}
              </select>
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-xs font-semibold uppercase text-gray-700 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Select Subject</option>
              {subjects.map((s, i) => (<option key={i} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-xs font-semibold uppercase text-gray-700 mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={showAll} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold transition shadow-sm">Show All</button>
            <button onClick={showFiltered} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold transition shadow-sm">Search</button>
          </div>
        </div>

        {/* Attendance table */}
        {loading ? (
          <div className="text-center py-8 text-gray-600 font-medium">Loading records...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                  <th className="p-3 text-center w-12">#</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center w-32">Date</th>
                  <th className="p-3 text-center w-28">Time</th>
                  <th className="p-3 text-center w-28">Present Count</th>
                  <th className="p-3 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {attendance.length > 0 ? attendance.map((a, i) => (
                  <tr key={a.id || i} className="hover:bg-gray-50">
                    <td className="p-3 text-center text-gray-600">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{a.user ? `${a.user.firstName || ''} ${a.user.lastName || ''}`.trim() || a.user.username : "N/A"}</td>
                    <td className="p-3 text-gray-800">{a.subject?.name || "N/A"}</td>
                    <td className="p-3 text-center text-gray-600">{a.date}</td>
                    <td className="p-3 text-center text-gray-600">{a.time}</td>
                    <td className="p-3 text-center font-bold text-blue-700">{a.numberOfStudents || (a.students ? a.students.length : 0)}</td>
                    <td className="p-3 text-center space-x-2">
                      <button onClick={() => showStudents(a.students)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 px-2.5 py-1 rounded text-xs font-semibold transition">
                        View List
                      </button>
                      <button onClick={() => handleDeleteAttendance(a.id)} className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500 text-sm">No attendance logs found matching the filter criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded border border-gray-300 shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
              <h3 className="font-bold text-gray-800 text-base">Present Students List</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            </div>
            {modalStudents.length > 0 ? (
              <ul className="divide-y divide-gray-100 text-sm max-h-60 overflow-y-auto">
                {modalStudents.map((s, idx) => (
                  <li key={s.id || idx} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{s.name || s.username}</span>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200 font-semibold">Present</span>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-gray-500 text-center py-4 text-sm">No present student records logged.</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;


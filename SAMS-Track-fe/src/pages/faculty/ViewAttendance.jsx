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
    userService.getAllFaculty()
      .then((data) => setFaculties(data))
      .catch((err) => console.error(err));

    subjectService.getAll()
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, []);

  const showAll = () => {
    setLoading(true);
    attendanceService.getAllRecords()
      .then((data) => setAttendance(data))
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

  const getBackgroundClass = () => {
    if (role === "admin") return "bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200";
    return "bg-gradient-to-br from-green-200 via-blue-200 to-purple-200";
  };

  const getHeaderColor = () => {
    if (role === "admin") return "text-blue-700";
    return "text-green-700";
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} flex flex-col`}>
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="p-6 max-w-6xl mx-auto flex-grow w-full">
        <h2 className={`text-2xl font-bold mb-6 text-center ${getHeaderColor()}`}>View Attendance</h2>
        
        {/* filters */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex flex-wrap gap-4 mb-6 items-end">
          {role === "admin" && (
            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 text-gray-700">Faculty</label>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="">Select Faculty</option>
                {faculties.map((f, i) => (<option key={i} value={f.username}>{f.firstName} {f.lastName}</option>))}
              </select>
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 text-gray-700">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Select Subject</option>
              {subjects.map((s, i) => (<option key={i} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 text-gray-700">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {role === "admin" && (<button onClick={showAll} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition">Show All</button>)}
            <button onClick={showFiltered} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">Search</button>
          </div>
        </div>

        {/* attendance table */}
        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4 border border-gray-300">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border px-4 py-2 text-center w-16">#</th>
                  <th className="border px-4 py-2">Faculty</th>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2 text-center w-32">Date</th>
                  <th className="border px-4 py-2 text-center w-28">Time</th>
                  <th className="border px-4 py-2 text-center w-24">Count</th>
                  <th className="border px-4 py-2 text-center w-28">Details</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? attendance.map((a, i) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{i + 1}</td>
                    <td className="border px-4 py-2">{a.user?.firstName} {a.user?.lastName}</td>
                    <td className="border px-4 py-2">{a.subject?.name}</td>
                    <td className="border px-4 py-2 text-center">{a.date}</td>
                    <td className="border px-4 py-2 text-center">{a.time}</td>
                    <td className="border px-4 py-2 text-center">{a.numberOfStudents}</td>
                    <td className="border px-4 py-2 text-center">
                      <button onClick={() => showStudents(a.students)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold transition">Show</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center p-4 text-gray-500 border">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 border border-gray-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-blue-600 text-lg">Students</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-xl font-semibold">✕</button>
            </div>
            {modalStudents.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 max-h-60 overflow-y-auto space-y-1">
                {modalStudents.map((s) => (<li key={s.id}>{s.name}</li>))}
              </ul>
            ) : (<p className="text-gray-500 text-center py-2">No students</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;

import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import FacultyMenu from "./FacultyMenu";

function ViewAttendance() {
  const role = localStorage.getItem("role");
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalStudents, setModalStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8091/user/get-all-faculty/")
      .then((res) => res.json())
      .then((data) => setFaculties(data))
      .catch((err) => console.error(err));
    fetch("http://localhost:8091/subject/get-all-subjects/")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, []);

  const showAll = () => {
    fetch("http://localhost:8091/attendance/get-all-attendance-records/")
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  };

  const showFiltered = () => {
    if (!selectedFaculty || !selectedSubject || !selectedDate) {
      alert("Please select all filters!");
      return;
    }
    fetch(`http://localhost:8091/attendance/get-attendance/${selectedFaculty}/${selectedSubject}/${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  };

  const showStudents = (students) => {
    setModalStudents(Array.isArray(students) ? students : []);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">View Attendance</h2>
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          {role === "admin" && (
            <div className="flex flex-col">
              <label className="text-sm mb-1">Faculty</label>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="border p-2 rounded">
                <option value="">Select Faculty</option>
                {faculties.map((f, i) => (<option key={i} value={f.username}>{f.firstName} {f.lastName}</option>))}
              </select>
            </div>
          )}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="border p-2 rounded">
              <option value="">Select Subject</option>
              {subjects.map((s, i) => (<option key={i} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
          </div>
          <div className="flex gap-2">
            {role === "admin" && (<button onClick={showAll} className="bg-green-500 text-white px-4 py-2 rounded">Show All</button>)}
            <button onClick={showFiltered} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
          </div>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Faculty</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Count</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? attendance.map((a, i) => (
              <tr key={a.id} className="text-center">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{a.user?.firstName} {a.user?.lastName}</td>
                <td className="border p-2">{a.subject?.name}</td>
                <td className="border p-2">{a.date}</td>
                <td className="border p-2">{a.time}</td>
                <td className="border p-2">{a.numberOfStudents}</td>
                <td className="border p-2">
                  <button onClick={() => showStudents(a.students)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Show</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" className="text-center p-4 text-gray-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Students</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            {modalStudents.length > 0 ? (
              <ul className="list-disc pl-5">{modalStudents.map((s) => (<li key={s.id}>{s.name}</li>))}</ul>
            ) : (<p className="text-gray-500">No students</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;

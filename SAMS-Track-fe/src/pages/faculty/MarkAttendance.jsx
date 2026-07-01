import { useEffect, useState } from "react";
import FacultyMenu from "../../components/FacultyMenu";
import { subjectService } from "../../services/subjectService";
import { studentService } from "../../services/studentService";
import { attendanceService } from "../../services/attendanceService";

function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("10:00");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");

  useEffect(() => {
    subjectService.getByFaculty(username)
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, [username]);

  useEffect(() => {
    studentService.getAll()
      .then((data) => {
        setStudents(data);
        const initial = {};
        data.forEach((s) => (initial[s.id] = false));
        setAttendance(initial);
      })
      .catch((err) => console.error(err));
  }, []);

  const enrolledMatches = selectedSubject
    ? students.filter((s) => s.subjects && s.subjects.some((sub) => sub.id === Number(selectedSubject)))
    : [];
  const filteredStudents = selectedSubject
    ? (enrolledMatches.length > 0 ? enrolledMatches : students)
    : [];

  const toggleStudent = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    const updated = { ...attendance };
    filteredStudents.forEach((s) => (updated[s.id] = true));
    setAttendance(updated);
  };

  const deselectAll = () => {
    const updated = { ...attendance };
    filteredStudents.forEach((s) => (updated[s.id] = false));
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !date || !time) {
      alert("Please select a subject, date, and time!");
      return;
    }

    const selectedStudents = filteredStudents
      .filter((s) => attendance[s.id])
      .map((s) => ({ id: s.id }));

    if (selectedStudents.length === 0) {
      if (!window.confirm("No students are marked as present. Do you want to submit all as Absent?")) {
        return;
      }
    }

    const payload = {
      username: username,
      subjectId: Number(selectedSubject),
      date: date,
      time: time,
      students: selectedStudents,
    };

    setLoading(true);
    try {
      await attendanceService.takeAttendance(payload);
      alert("Attendance recorded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error while recording attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <FacultyMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
            <p className="text-sm text-gray-600">Select course subject and mark student presence</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm flex flex-col gap-5">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Time Slot</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick toggle bar */}
          {selectedSubject && (
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 text-xs">
              <span className="font-semibold text-gray-700">
                Enrolled Students: {filteredStudents.length} | Marked Present: {filteredStudents.filter(s => attendance[s.id]).length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded font-semibold transition"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded font-semibold transition"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          )}

          {/* Student list */}
          <div className="border border-gray-300 rounded overflow-hidden overflow-x-auto">
            {!selectedSubject ? (
              <p className="text-gray-500 text-center py-8 text-sm">Please select a subject above to view enrolled students.</p>
            ) : filteredStudents.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                    <th className="p-3 w-16 text-center">ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center w-32">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filteredStudents.map((student) => {
                    const isPresent = !!attendance[student.id];
                    return (
                      <tr key={student.id} className={isPresent ? "bg-green-50/50" : "hover:bg-gray-50"}>
                        <td className="p-3 text-center text-gray-600">{student.id}</td>
                        <td className="p-3 font-medium text-gray-800">{student.name || student.username}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStudent(student.id)}
                            className={`px-3 py-1 rounded text-xs font-bold transition border ${
                              isPresent
                                ? "bg-green-600 text-white border-green-700"
                                : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                            }`}
                          >
                            {isPresent ? "✓ PRESENT" : "✗ ABSENT"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No students enrolled in this subject.</p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedSubject}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded font-semibold text-sm transition shadow disabled:opacity-50"
            >
              {loading ? "Saving Attendance..." : "Save Attendance Record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;


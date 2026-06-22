import { useEffect, useState } from "react";
import FacultyMenu from "../../components/FacultyMenu";
import { subjectService } from "../../services/subjectService";
import { studentService } from "../../services/studentService";
import { attendanceService } from "../../services/attendanceService";

function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");

  // fetch subjects
  useEffect(() => {
    subjectService.getByFaculty(username)
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, [username]);

  // fetch students
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

  // Filter students enrolled in the selected subject
  const filteredStudents = selectedSubject
    ? students.filter((s) => s.subjects && s.subjects.some((sub) => sub.id === Number(selectedSubject)))
    : [];

  // toggle checkbox
  const toggleStudent = (id) => {
    setAttendance({ ...attendance, [id]: !attendance[id] });
  };

  // select all
  const selectAll = () => {
    const updated = { ...attendance };
    filteredStudents.forEach((s) => (updated[s.id] = true));
    setAttendance(updated);
  };

  // deselect all
  const deselectAll = () => {
    const updated = { ...attendance };
    filteredStudents.forEach((s) => (updated[s.id] = false));
    setAttendance(updated);
  };

  // submit
  const handleSubmit = async () => {
    if (!selectedSubject || !date || !time) {
      alert("Please fill all fields!");
      return;
    }

    const selectedStudents = filteredStudents
      .filter((s) => attendance[s.id])
      .map((s) => ({ id: s.id }));

    if (selectedStudents.length === 0) {
      alert("Please select at least one student!");
      return;
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
      alert("Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      alert("Error while marking attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex flex-col">
      <FacultyMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Mark Attendance</h2>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 flex flex-col gap-4">
          {/* subject, date, time */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* select all / deselect all buttons */}
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded font-semibold text-sm transition"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded font-semibold text-sm transition"
            >
              Deselect All
            </button>
          </div>

          {/* students list */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
            {!selectedSubject ? (
              <p className="text-gray-500 text-center py-4">Please select a subject to load students.</p>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center mb-2 last:mb-0 hover:bg-gray-200/55 p-1 rounded">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={attendance[student.id] || false}
                    onChange={() => toggleStudent(student.id)}
                    className="mr-2 cursor-pointer focus:ring-blue-400 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`student-${student.id}`} className="cursor-pointer text-gray-700 select-none">
                    {student.id} - {student.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No students enrolled in this subject.</p>
            )}
          </div>

          {/* submit button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;

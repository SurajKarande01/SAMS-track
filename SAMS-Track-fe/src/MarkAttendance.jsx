import { useEffect, useState } from "react";
import FacultyMenu from "./FacultyMenu";

function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendance, setAttendance] = useState({});

  const username = localStorage.getItem("username");

  // fetch subjects
  useEffect(() => {
    fetch("http://localhost:8091/subject/get-all-subjects/")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, []);

  // fetch students
  useEffect(() => {
    fetch("http://localhost:8091/student/get-all-students/")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        // set all to false initially
        const initial = {};
        data.forEach((s) => (initial[s.id] = false));
        setAttendance(initial);
      })
      .catch((err) => console.error(err));
  }, []);

  // toggle checkbox
  const toggleStudent = (id) => {
    setAttendance({ ...attendance, [id]: !attendance[id] });
  };

  // select all
  const selectAll = () => {
    const updated = {};
    students.forEach((s) => (updated[s.id] = true));
    setAttendance(updated);
  };

  // deselect all
  const deselectAll = () => {
    const updated = {};
    students.forEach((s) => (updated[s.id] = false));
    setAttendance(updated);
  };

  // submit
  const handleSubmit = async () => {
    if (!selectedSubject || !date || !time) {
      alert("Please fill all fields!");
      return;
    }

    const selectedStudents = students
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

    try {
      const res = await fetch(
        "http://localhost:8091/attendance/take-attendance/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Attendance marked successfully!");
      } else {
        alert("Failed to mark attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while marking attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FacultyMenu />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Mark Attendance</h2>

        {/* subject, date, time */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border p-2 rounded flex-1"
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
            className="border p-2 rounded flex-1"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded flex-1"
          />
        </div>

        {/* select all / deselect all buttons */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={selectAll}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
          >
            Deselect All
          </button>
        </div>

        {/* students list */}
        <div className="border rounded p-4 bg-white mb-6">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={attendance[student.id] || false}
                  onChange={() => toggleStudent(student.id)}
                  className="mr-2"
                />
                <span>
                  {student.id} - {student.name}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No students found</p>
          )}
        </div>

        {/* submit button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;

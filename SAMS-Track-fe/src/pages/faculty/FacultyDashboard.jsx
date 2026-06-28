import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FacultyMenu from "../../components/FacultyMenu";
import { studentService } from "../../services/studentService";
import { subjectService } from "../../services/subjectService";
import { marksService } from "../../services/marksService";
import { attendanceService } from "../../services/attendanceService";
import { 
  Users, BookOpen, PlusCircle, CheckSquare, Award, Trash2, Eye, Calendar, Printer, FileText, ChevronRight, X 
} from "lucide-react";

function FacultyDashboard() {
  const loggedInUser = localStorage.getItem("username");
  
  // Data States
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [marksList, setMarksList] = useState([]);
  
  // Modal / Form States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  
  // Attendance Form States
  const [attSubject, setAttSubject] = useState("");
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attTime, setAttTime] = useState("10:00");
  const [attSelectedStudents, setAttSelectedStudents] = useState([]);

  // Marks Form States
  const [markStudent, setMarkStudent] = useState("");
  const [markSubject, setMarkSubject] = useState("");
  const [markValue, setMarkValue] = useState("");
  const [markTerm, setMarkTerm] = useState("weekly");
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);

  // Quick Subject Form State
  const [newSubjectName, setNewSubjectName] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, [loggedInUser]);

  /**
   * fetchData: Async function that retrieves all critical faculty dashboard data.
   * Fetches subjects assigned to the current faculty, all students, all subjects, and all marks.
   */
  const fetchData = async () => {
    try {
      if (loggedInUser) {
        // Fetch subjects assigned to current faculty
        const assigned = await subjectService.getByFaculty(loggedInUser);
        setAssignedSubjects(assigned || []);
      }

      // Fetch all students
      const allStuds = await studentService.getAll();
      setStudents(allStuds || []);

      // Fetch all subjects
      const subjects = await subjectService.getAll();
      setAllSubjects(subjects || []);

      // Fetch all marks
      const marks = await marksService.getAll();
      setMarksList(marks || []);
    } catch (err) {
      console.error("Error fetching faculty dashboard data:", err);
    }
  };

  /**
   * handleAddSubject: Handles submission of the quick add subject form.
   * Registers a new subject and assigns the current faculty user to it.
   *
   * @param {Object} e - React form submission event
   */
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      await subjectService.add(newSubjectName.trim(), loggedInUser);

      setSuccessMsg("Subject created successfully!");
      setNewSubjectName("");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to add subject");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  /**
   * handleDeleteStudent: Deletes a student profile from the database by ID.
   *
   * @param {number} id - Student ID to delete
   */
  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student profile?")) {
      try {
        await studentService.delete(id);
        setSuccessMsg("Student deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchData();
      } catch (err) {
        setErrorMsg("Failed to delete student");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  /**
   * handleSaveAttendance: Submits the marked attendance record for selected student IDs.
   *
   * @param {Object} e - Submit event
   */
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!attSubject) {
      alert("Please select a subject");
      return;
    }

    try {
      const payload = {
        faculty: loggedInUser,
        subjectId: parseInt(attSubject),
        date: attDate,
        time: attTime,
        studentIds: attSelectedStudents.map(id => parseInt(id))
      };

      await attendanceService.takeAttendance(payload);
      setSuccessMsg("Attendance recorded successfully!");
      setShowAttendanceModal(false);
      setAttSelectedStudents([]);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to record attendance");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  /**
   * handleSaveMarks: Saves a student's mark entry for a specific subject and term.
   *
   * @param {Object} e - Submit event
   */
  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!markStudent || !markSubject || !markValue) {
      alert("Please fill all marks fields");
      return;
    }

    try {
      const payload = {
        student: { id: parseInt(markStudent) },
        subject: { id: parseInt(markSubject) },
        marks: parseInt(markValue),
        term: markTerm,
        date: markDate
      };

      await marksService.add(payload);
      setSuccessMsg("Marks recorded successfully!");
      setMarkValue("");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to record marks");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  /**
   * handleDeleteMark: Deletes a specific marks entry from the academic logs.
   *
   * @param {number} id - Marks record ID
   */
  const handleDeleteMark = async (id) => {
    if (window.confirm("Are you sure you want to delete this marks entry?")) {
      try {
        await marksService.delete(id);
        setSuccessMsg("Marks record deleted!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchData();
      } catch (err) {
        setErrorMsg("Failed to delete marks record");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  /**
   * toggleAttStudent: Toggles selection state of a student when marking attendance.
   *
   * @param {number} id - Student ID to toggle
   */
  const toggleAttStudent = (id) => {
    if (attSelectedStudents.includes(id)) {
      setAttSelectedStudents(attSelectedStudents.filter(sid => sid !== id));
    } else {
      setAttSelectedStudents([...attSelectedStudents, id]);
    }
  };

  /**
   * handlePrintReport: Opens browser print window for student academic report card.
   *
   * @param {string} term - Evaluation term (weekly/monthly/midterm/final)
   */
  const handlePrintReport = (term) => {
    const printContent = document.getElementById("student-report-print-area").innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Create print layout
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; color: #111;">
        <h1 style="border-bottom: 2px solid #6366f1; padding-bottom: 10px; color: #4f46e5;">SAMS-TRACK - Student Academic Report</h1>
        <h3 style="margin-top: 20px;">Report Cycle: ${term.toUpperCase()} EVALUATIONS</h3>
        ${printContent}
      </div>
    `;
    window.print();
    // Restore
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col">
      <FacultyMenu />

      <div className="p-6 md:p-8 flex-grow max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Faculty Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage student registries, check classrooms/courses, log daily attendance, and enter academic marks.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 min-w-[120px] text-center shadow">
              <div className="text-2xl font-bold text-blue-700">{assignedSubjects.length}</div>
              <div className="text-xs text-gray-500 font-semibold mt-1">Assigned Classes</div>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 min-w-[120px] text-center shadow">
              <div className="text-2xl font-bold text-green-700">{students.length}</div>
              <div className="text-xs text-gray-500 font-semibold mt-1">Total Students</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-6 bg-green-100 text-green-800 px-5 py-3 rounded-lg border border-green-300 text-sm font-semibold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 bg-red-100 text-red-800 px-5 py-3 rounded-lg border border-red-300 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* WORKSTATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main workspace (Colspan 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Assigned Classrooms / Courses */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <span>📖 Assigned Classrooms / Courses</span>
                </h2>
                <p className="text-xs text-gray-500">Classrooms assigned to your account</p>
              </div>

              {assignedSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedSubjects.map((sub) => (
                    <div key={sub.id} className="p-5 rounded-lg border border-gray-300 bg-gray-50 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-3 border border-blue-200">
                          {sub.name.charAt(0)}
                        </div>
                        <h3 className="font-bold text-gray-800 text-base">{sub.name}</h3>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 mt-1.5 inline-block">
                          Active Course
                        </span>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => {
                            setAttSubject(sub.id.toString());
                            setShowAttendanceModal(true);
                          }}
                          className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded text-xs transition"
                        >
                          Take Attendance
                        </button>
                        <button
                          onClick={() => {
                            setMarkSubject(sub.id.toString());
                            setShowMarksModal(true);
                          }}
                          className="flex-grow bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded text-xs transition"
                        >
                          Log Marks
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  No courses are currently assigned to you. Use the "Quick Add Subject" tool on the right to start.
                </div>
              )}
            </div>

            {/* Students List */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                    <span>👥 Registered Students</span>
                  </h2>
                  <p className="text-xs text-gray-500">Click on a student's name to view report & profile details</p>
                </div>
                <Link
                  to="/add-student"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xs px-3.5 py-2 rounded-lg border border-blue-300 transition"
                >
                  + Add Student
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-gray-800 text-xs font-bold">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Contact</th>
                      <th className="border px-4 py-2">Parent Contact</th>
                      <th className="border px-4 py-2 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {students.length > 0 ? (
                      students.map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="border px-4 py-3 font-semibold text-gray-800">
                            <button
                              onClick={() => {
                                setSelectedStudent(st);
                                setShowReportModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline text-left font-bold"
                            >
                              {st.name || st.username}
                            </button>
                          </td>
                          <td className="border px-4 py-3 text-gray-600">{st.contactNo || "N/A"}</td>
                          <td className="border px-4 py-3 text-gray-600">{st.parentNo || "N/A"}</td>
                          <td className="border px-4 py-3 text-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedStudent(st);
                                setShowReportModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold transition inline-block"
                              title="View Report / Profile"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold transition inline-block"
                              title="Delete Student"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-400 text-sm border">
                          No students found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Quick settings sidebar */}
          <div className="space-y-8">
            
            {/* Quick add subject */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg">
              <h3 className="font-bold text-blue-700 text-base mb-1">Quick Add Subject</h3>
              <p className="text-xs text-gray-500 mb-5">Create a classroom and assign to your account</p>

              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Subject Name</label>
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g. Chemistry II"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
                >
                  Create & Link Subject
                </button>
              </form>
            </div>

            {/* Quick Navigation Menu */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg space-y-3">
              <h3 className="font-bold text-blue-700 text-base mb-3">Shortcut Actions</h3>
              
              <button
                onClick={() => {
                  setAttSubject("");
                  setShowAttendanceModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-300 rounded-lg hover:border-blue-300 transition text-sm font-semibold text-gray-700"
              >
                <span>📝 Take Attendance</span>
                <span className="text-gray-400">➡️</span>
              </button>

              <button
                onClick={() => {
                  setMarkStudent("");
                  setMarkSubject("");
                  setShowMarksModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-300 rounded-lg hover:border-blue-300 transition text-sm font-semibold text-gray-700"
              >
                <span>🏆 Log Marks & Grades</span>
                <span className="text-gray-400">➡️</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 1. REPORT / PROFILE MODAL */}
      {showReportModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl border border-gray-300 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowReportModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <div id="student-report-print-area">
              <div className="mb-6">
                <span className="text-xs text-blue-700 font-extrabold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  Student Data Profile
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {selectedStudent.name || selectedStudent.username}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Linked parent credentials & grade summary</p>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg border border-gray-300 mb-6 text-sm">
                <div>
                  <span className="text-gray-500 font-semibold block text-xs">Email:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block text-xs">Student Contact No:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.contactNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block text-xs">Parent Contact No:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.parentNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block text-xs">Address:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.address || "N/A"}</span>
                </div>
              </div>

              {/* Marks Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-blue-700 text-sm mb-3">Academic Performance & Grades</h3>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {marksList.filter(m => m.student?.id === selectedStudent.id).length > 0 ? (
                    marksList
                      .filter(m => m.student?.id === selectedStudent.id)
                      .map(m => (
                        <div key={m.id} className="p-3 bg-white border border-gray-300 rounded-lg flex justify-between items-center text-sm shadow-sm">
                          <div>
                            <span className="font-bold text-gray-800">{m.subject?.name || "Subject"}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{m.date} ({m.term})</span>
                          </div>
                          <div className="font-extrabold text-blue-700">{m.marks} / 100</div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      No registered evaluations found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-300 flex flex-wrap gap-3">
              <button
                onClick={() => handlePrintReport("weekly")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-xs transition"
              >
                🖨️ Generate Weekly Report
              </button>

              <button
                onClick={() => handlePrintReport("monthly")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-xs transition"
              >
                📄 Generate Monthly Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. TAKE ATTENDANCE MODAL */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-300 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowAttendanceModal(false);
                setAttSelectedStudents([]);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-700">Record Attendance</h2>
              <p className="text-xs text-gray-500">Log presence of students for a particular subject & date</p>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Subject</label>
                  <select
                    value={attSubject}
                    onChange={(e) => setAttSubject(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Subject</option>
                    {allSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Time</label>
                  <input
                    type="text"
                    value={attTime}
                    onChange={(e) => setAttTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Student Presence Checklist */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">
                  Check present students ({attSelectedStudents.length} selected)
                </label>

                <div className="border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto p-3 space-y-2 bg-gray-50">
                  {students.map(st => {
                    const isChecked = attSelectedStudents.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleAttStudent(st.id)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition text-sm ${
                          isChecked 
                            ? "bg-blue-50 border-blue-300 font-semibold text-blue-900" 
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <span>{st.name || st.username}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                        }`}>
                          {isChecked && <span className="text-[9px] font-bold">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition"
              >
                Save Attendance Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. LOG MARKS & GRADES MODAL */}
      {showMarksModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-300 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowMarksModal(false);
                setMarkStudent("");
                setMarkValue("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-700">Grades & Marks Workstation</h2>
              <p className="text-xs text-gray-500">Log scores or manage existing evaluations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Form to log new marks */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-gray-800 mb-1 border-b pb-1 border-gray-200">Log Mark Entry</h3>
                <form onSubmit={handleSaveMarks} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs text-gray-600">Student</label>
                    <select
                      value={markStudent}
                      onChange={(e) => setMarkStudent(e.target.value)}
                      className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(st => (
                        <option key={st.id} value={st.id}>{st.name || st.username}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs text-gray-600">Subject</label>
                    <select
                      value={markSubject}
                      onChange={(e) => setMarkSubject(e.target.value)}
                      className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Subject</option>
                      {allSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600">Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={markValue}
                        onChange={(e) => setMarkValue(e.target.value)}
                        placeholder="85"
                        className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600">Evaluation Type</label>
                      <select
                        value={markTerm}
                        onChange={(e) => setMarkTerm(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-xs focus:outline-none"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs text-gray-600">Date</label>
                    <input
                      type="date"
                      value={markDate}
                      onChange={(e) => setMarkDate(e.target.value)}
                      className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition"
                  >
                    Submit Mark Record
                  </button>
                </form>
              </div>

              {/* Right Column: List of existing marks to delete/modify */}
              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-1 border-b pb-1 border-gray-200">All Mark Entries</h3>
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {marksList.length > 0 ? (
                    marksList.map(m => (
                      <div key={m.id} className="p-3 bg-gray-50 border border-gray-300 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-gray-800">{m.student?.name || "Student"}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {m.subject?.name || "Subject"} | {m.marks}pts | {m.term}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMark(m.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                          title="Delete Entry"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-gray-400">
                      No evaluation history log found.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FacultyDashboard;

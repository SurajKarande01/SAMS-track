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

  // Add Subject action
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      // API expects name and facultyUsername
      await subjectService.add(newSubjectName.trim());
      
      // Update with current facultyUsername if recently added
      const allSubs = await subjectService.getAll();
      const added = allSubs.find(s => s.name === newSubjectName.trim() && !s.facultyUsername);
      if (added) {
        added.facultyUsername = loggedInUser;
        await subjectService.update(added.id, added.name, added.facultyUsername); // Updates association
      }

      setSuccessMsg("Subject created successfully!");
      setNewSubjectName("");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to add subject");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Delete Student action
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

  // Attendance Submission
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

  // Marks Submission
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

  const toggleAttStudent = (id) => {
    if (attSelectedStudents.includes(id)) {
      setAttSelectedStudents(attSelectedStudents.filter(sid => sid !== id));
    } else {
      setAttSelectedStudents([...attSelectedStudents, id]);
    }
  };

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
    <div className="min-h-screen bg-[#fafafc] text-gray-900 font-sans flex flex-col">
      <FacultyMenu />

      <div className="p-6 md:p-8 flex-grow max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
              Faculty Access
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-gray-900">
              Faculty Workstation
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage student registries, check classrooms/courses, log daily attendance, and enter academic marks.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-2xl font-bold text-indigo-600">{assignedSubjects.length}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Assigned Classes</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-2xl font-bold text-emerald-600">{students.length}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Total Students</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl border border-emerald-100 text-sm font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 text-rose-700 px-5 py-3 rounded-2xl border border-rose-100 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* WORKSTATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main workspace (Colspan 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Assigned Classrooms / Courses */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <span>Assigned Classrooms / Courses</span>
                  </h2>
                  <p className="text-xs text-gray-400">Classrooms assigned to your account</p>
                </div>
              </div>

              {assignedSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedSubjects.map((sub) => (
                    <div key={sub.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between hover:border-indigo-200 transition duration-300">
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-3">
                          {sub.name.charAt(0)}
                        </div>
                        <h3 className="font-bold text-gray-800 text-base">{sub.name}</h3>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded mt-1.5 inline-block">
                          Active Course
                        </span>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => {
                            setAttSubject(sub.id.toString());
                            setShowAttendanceModal(true);
                          }}
                          className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Attendance</span>
                        </button>
                        <button
                          onClick={() => {
                            setMarkSubject(sub.id.toString());
                            setShowMarksModal(true);
                          }}
                          className="flex-grow bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Log Marks</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
                  No courses are currently assigned to you. Use the "Quick Add Subject" tool on the right to start.
                </div>
              )}
            </div>

            {/* Students List */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span>Registered Students</span>
                  </h2>
                  <p className="text-xs text-gray-400">Click on a student's name to view report & profile details</p>
                </div>
                <Link
                  to="/add-student"
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Parent Contact</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {students.length > 0 ? (
                      students.map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50/40 transition duration-150">
                          <td className="py-3.5 font-semibold text-gray-800">
                            <button
                              onClick={() => {
                                setSelectedStudent(st);
                                setShowReportModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline text-left font-bold"
                            >
                              {st.name || st.username}
                            </button>
                          </td>
                          <td className="py-3.5 text-gray-500 font-medium">{st.contactNo || "N/A"}</td>
                          <td className="py-3.5 text-gray-500 font-medium">{st.parentNo || "N/A"}</td>
                          <td className="py-3.5 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStudent(st);
                                  setShowReportModal(true);
                                }}
                                className="bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-gray-600 transition"
                                title="View Report / Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(st.id)}
                                className="bg-rose-50 hover:bg-rose-100 p-2 rounded-lg text-rose-600 transition"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-400 text-sm">
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
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-base mb-2">Quick Add Subject</h3>
              <p className="text-xs text-gray-400 mb-5">Create a classroom and assign to your account</p>

              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <label className="block mb-1.5 font-bold text-xs text-gray-400 uppercase tracking-wider">Subject Name</label>
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g. Chemistry II"
                    className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50 text-sm"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200"
                >
                  Create & Link Subject
                </button>
              </form>
            </div>

            {/* Quick Navigation Menu */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 text-base mb-2">Shortcut Actions</h3>
              
              <button
                onClick={() => {
                  setAttSubject("");
                  setShowAttendanceModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition group text-sm font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                  Take Attendance
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition duration-250" />
              </button>

              <button
                onClick={() => {
                  setMarkStudent("");
                  setMarkSubject("");
                  setShowMarksModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition group text-sm font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Log Marks & Grades
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition duration-250" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 1. REPORT / PROFILE MODAL */}
      {showReportModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-xl relative">
            <button
              onClick={() => {
                setShowReportModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div id="student-report-print-area">
              <div className="mb-6">
                <span className="text-xs text-indigo-600 font-extrabold bg-indigo-50 px-2 py-0.5 rounded">
                  Student Data Profile
                </span>
                <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
                  {selectedStudent.name || selectedStudent.username}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Linked parent credentials & grade summary</p>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100 mb-6 text-sm">
                <div>
                  <span className="text-gray-400 font-semibold block text-xs">Email:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-xs">Student Contact No:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.contactNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-xs">Parent Contact No:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.parentNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-xs">Address:</span>
                  <span className="font-bold text-gray-700">{selectedStudent.address || "N/A"}</span>
                </div>
              </div>

              {/* Marks Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Academic Performance & Grades</h3>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {marksList.filter(m => m.student?.id === selectedStudent.id).length > 0 ? (
                    marksList
                      .filter(m => m.student?.id === selectedStudent.id)
                      .map(m => (
                        <div key={m.id} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center text-sm shadow-xs">
                          <div>
                            <span className="font-bold text-gray-800">{m.subject?.name || "Subject"}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{m.date} ({m.term})</span>
                          </div>
                          <div className="font-extrabold text-indigo-600">{m.marks} / 100</div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      No registered evaluations found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
              <button
                onClick={() => handlePrintReport("weekly")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generate Weekly Report</span>
              </button>

              <button
                onClick={() => handlePrintReport("monthly")}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Monthly Report</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. TAKE ATTENDANCE MODAL */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-xl relative">
            <button
              onClick={() => {
                setShowAttendanceModal(false);
                setAttSelectedStudents([]);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Record Attendance</h2>
              <p className="text-xs text-gray-400">Log presence of students for a particular subject & date</p>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Subject</label>
                  <select
                    value={attSubject}
                    onChange={(e) => setAttSubject(e.target.value)}
                    className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    <option value="">Select Subject</option>
                    {allSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Time</label>
                  <input
                    type="text"
                    value={attTime}
                    onChange={(e) => setAttTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              {/* Student Presence Checklist */}
              <div>
                <label className="block mb-2 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Check present students ({attSelectedStudents.length} selected)
                </label>

                <div className="border border-gray-100 rounded-2xl max-h-[200px] overflow-y-auto p-3 space-y-2 bg-gray-50/50">
                  {students.map(st => {
                    const isChecked = attSelectedStudents.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleAttStudent(st.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-sm ${
                          isChecked 
                            ? "bg-indigo-50 border-indigo-200 font-semibold text-indigo-900" 
                            : "bg-white border-gray-100"
                        }`}
                      >
                        <span>{st.name || st.username}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                Save Attendance Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. LOG MARKS & GRADES MODAL */}
      {showMarksModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-xl relative">
            <button
              onClick={() => {
                setShowMarksModal(false);
                setMarkStudent("");
                setMarkValue("");
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Grades & Marks Workstation</h2>
              <p className="text-xs text-gray-400">Log scores or manage existing evaluations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Form to log new marks */}
              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-3.5">Log Mark Entry</h3>
                <form onSubmit={handleSaveMarks} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-bold text-xs text-gray-500">Student</label>
                    <select
                      value={markStudent}
                      onChange={(e) => setMarkStudent(e.target.value)}
                      className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-xs focus:outline-none focus:ring-2"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(st => (
                        <option key={st.id} value={st.id}>{st.name || st.username}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-xs text-gray-500">Subject</label>
                    <select
                      value={markSubject}
                      onChange={(e) => setMarkSubject(e.target.value)}
                      className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-xs focus:outline-none focus:ring-2"
                      required
                    >
                      <option value="">Select Subject</option>
                      {allSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 font-bold text-xs text-gray-500">Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={markValue}
                        onChange={(e) => setMarkValue(e.target.value)}
                        placeholder="85"
                        className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-xs focus:outline-none focus:ring-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-xs text-gray-500">Evaluation Type</label>
                      <select
                        value={markTerm}
                        onChange={(e) => setMarkTerm(e.target.value)}
                        className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-xs focus:outline-none"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-xs text-gray-500">Date</label>
                    <input
                      type="date"
                      value={markDate}
                      onChange={(e) => setMarkDate(e.target.value)}
                      className="w-full border border-gray-100 p-2.5 rounded-xl bg-gray-50/50 text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Submit Mark Record
                  </button>
                </form>
              </div>

              {/* Right Column: List of existing marks to delete/modify */}
              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-3">All Mark Entries</h3>
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {marksList.length > 0 ? (
                    marksList.map(m => (
                      <div key={m.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-gray-800">{m.student?.name || "Student"}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {m.subject?.name || "Subject"} | {m.marks}pts | {m.term}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMark(m.id)}
                          className="text-rose-600 hover:bg-rose-50 p-1.5 rounded"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { subjectService } from "../../services/subjectService";
import { marksService } from "../../services/marksService";
import { attendanceService } from "../../services/attendanceService";
import Logo from "../../components/Logo";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  BookOpen, Award, Calendar, User as UserIcon, LogOut, Settings, Trash2, Edit3, CheckCircle, Smartphone 
} from "lucide-react";

function StudentDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");
  const loggedInUser = localStorage.getItem("username");

  const [student, setStudent] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  // Tab & Graph states
  const [activeTab, setActiveTab] = useState("progress");
  const [graphView, setGraphView] = useState("weekly"); // "weekly" or "monthly"

  // Profile Edit states
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [parentNo, setParentNo] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!role || !studentId) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [studentId, role]);

  /**
   * fetchData: Async function that retrieves all critical student dashboard data.
   * Fetches student details, all subjects, enrolled subjects, marks/grades, and attendance.
   */
  const fetchData = async () => {
    try {
      // 1. Fetch Student Details
      const studentData = await studentService.getById(studentId);
      setStudent(studentData);
      setName(studentData.name || studentData.username || "");
      setEmail(studentData.email || "");
      setPassword(studentData.password || "");
      setAddress(studentData.address || "");
      setContactNo(studentData.contactNo || "");
      setParentNo(studentData.parentNo || "");

      // 2. Fetch All Subjects
      const subjectsData = await subjectService.getAll();
      setAllSubjects(subjectsData);

      // 3. Fetch Student's Enrolled Subjects
      const enrolledData = await studentService.getSubjects(studentId);
      setEnrolledSubjects(enrolledData || []);

      // 4. Fetch Marks
      const marksData = await marksService.getByStudent(studentId);
      setMarks(marksData || []);

      // 5. Fetch Attendance records to calculate percentage
      const attRecords = await attendanceService.getAllRecords();
      // Filter attendance records where student is present
      const studentAtt = attRecords.filter(record => 
        record.students && record.students.some(s => s.id === parseInt(studentId))
      );
      setAttendance(studentAtt);

    } catch (err) {
      console.error("Error fetching student dashboard data:", err);
    }
  };

  /**
   * handleChooseSubjects: Toggles subject enrollment for the student.
   * Enrolls the student if not already enrolled, or unenrolls if they are.
   *
   * @param {number} subjectId - The unique ID of the subject
   */
  const handleChooseSubjects = async (subjectId) => {
    let updatedIds = [];
    const isEnrolled = enrolledSubjects.some(s => s.id === subjectId);
    
    if (isEnrolled) {
      // Unenroll
      updatedIds = enrolledSubjects.filter(s => s.id !== subjectId).map(s => s.id);
    } else {
      // Enroll
      updatedIds = [...enrolledSubjects.map(s => s.id), subjectId];
    }

    try {
      await studentService.chooseSubjects(studentId, updatedIds);
      setSuccessMsg("Subject enrollment updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to update subject enrollment");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  /**
   * handleUpdateProfile: Submits updated profile information (address, contacts, email, password) to the API.
   *
   * @param {Object} e - Submit event
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...student,
        name,
        email,
        password,
        address,
        contactNo,
        parentNo
      };
      await studentService.update(updatedData);
      setSuccessMsg("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (err) {
      setErrorMsg("Failed to update profile");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  /**
   * handleDeleteProfile: Deletes the current student profile permanently and logs them out.
   */
  const handleDeleteProfile = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your profile? This action is permanent and will log you out.")) {
      try {
        await studentService.delete(studentId);
        handleLogout();
      } catch (err) {
        setErrorMsg("Failed to delete profile");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  /**
   * handleLogout: Clears user session keys from local storage and redirects to the home page.
   */
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("studentId");
    navigate("/");
  };

  /**
   * getChartData: Formats marks history for visualization in the progress AreaChart.
   * Filters by the selected term view (weekly/monthly) and sorts chronologically.
   *
   * @returns {Array<Object>} - Formatted recharts data points
   */
  const getChartData = () => {
    // Filter marks by view: weekly / monthly
    const filteredMarks = marks.filter(m => m.term?.toLowerCase() === graphView.toLowerCase());
    
    // Sort marks by date
    const sortedMarks = [...filteredMarks].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Map to recharts data format
    return sortedMarks.map(m => ({
      date: m.date,
      score: m.marks,
      subject: m.subject?.name || "Subject"
    }));
  };

  const chartData = getChartData();

  if (!student) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading Dashboard Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 text-gray-900 font-sans flex flex-col">
      {/* Top navbar */}
      <nav className="border-b border-gray-300 bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo showText={true} textClass="font-bold text-lg tracking-tight text-blue-700" />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg border border-gray-300">
              <span>Logged in as: <strong className="text-gray-900">{loggedInUser}</strong> ({role.toUpperCase()})</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-grow">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-blue-700 font-bold text-xs uppercase tracking-widest bg-blue-100 px-2.5 py-1 rounded border border-blue-200">
              {role === "parent" ? "Parent Access" : "Student Access"}
            </span>
            <h1 className="text-3xl font-bold text-blue-700 mt-3">
              Welcome back, {student.name}!
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {role === "parent" 
                ? "Monitoring your child's learning journey and academic evaluations."
                : "Track your academic journey, manage subjects, and visualize your progress."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 min-w-[120px] text-center shadow">
              <div className="text-2xl font-bold text-blue-700">{enrolledSubjects.length}</div>
              <div className="text-xs text-gray-500 font-semibold mt-1">Enrolled Subjects</div>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 min-w-[120px] text-center shadow">
              <div className="text-2xl font-bold text-green-700">
                {marks.length > 0 
                  ? (marks.reduce((acc, curr) => acc + curr.marks, 0) / marks.length).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-xs text-gray-500 font-semibold mt-1">Avg Marks</div>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 min-w-[120px] text-center shadow">
              <div className="text-2xl font-bold text-purple-700">{attendance.length}</div>
              <div className="text-xs text-gray-500 font-semibold mt-1">Present Days</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Dashboard Tabs & Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/60 p-1.5 rounded-xl w-fit border border-gray-300 shadow">
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition duration-200 border ${
              activeTab === "progress" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Progress Chart & Marks
          </button>
          
          <button
            onClick={() => setActiveTab("subjects")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition duration-200 border ${
              activeTab === "subjects" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Choose Subjects
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition duration-200 border ${
              activeTab === "profile" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Profile settings
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "progress" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual self progress graph */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-blue-700">Self-Progress Chart</h2>
                  <p className="text-xs text-gray-500">Academic performance history</p>
                </div>

                {/* Graph View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-300">
                  <button
                    onClick={() => setGraphView("weekly")}
                    className={`px-3 py-1 text-xs font-bold rounded transition ${
                      graphView === "weekly" ? "bg-blue-600 text-white" : "text-gray-700"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setGraphView("monthly")}
                    className={`px-3 py-1 text-xs font-bold rounded transition ${
                      graphView === "monthly" ? "bg-blue-600 text-white" : "text-gray-700"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {chartData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold', fontSize: 12, color: '#1e3a8a' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" name="Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 bg-gray-50">
                  No {graphView} progress records found yet
                </div>
              )}
            </div>

            {/* Read-Only Marks List */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-blue-700 font-bold">Grades & Marks</h2>
                <p className="text-xs text-gray-500">All registered marks (Read Only)</p>
              </div>

              <div className="flex-grow overflow-y-auto max-h-[310px] space-y-3 pr-1">
                {marks.length > 0 ? (
                  marks.map((m) => (
                    <div key={m.id} className="p-3 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-gray-800">{m.subject?.name || "Subject"}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <span>{m.date}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="capitalize">{m.term}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-700">{m.marks}</span>
                        <span className="text-xs text-gray-500 font-semibold">/100</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-sm text-gray-400">
                    No marks records available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-700">Enroll & Choose Subjects</h2>
              <p className="text-sm text-gray-600 mt-1">
                Toggle the subjects you want to enroll in. These are read-only for editing marks, but you can choose subjects freely.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allSubjects.map((sub) => {
                const isEnrolled = enrolledSubjects.some((e) => e.id === sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleChooseSubjects(sub.id)}
                    className={`p-5 rounded-lg border border-gray-300 cursor-pointer transition flex items-center justify-between group ${
                      isEnrolled 
                        ? "bg-blue-50 border-blue-400 text-blue-900" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-base text-gray-800">{sub.name}</div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {isEnrolled ? "✓ Enrolled" : "Click to enroll"}
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                      isEnrolled 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "border-gray-300 bg-white"
                    }`}>
                      {isEnrolled && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Profile Info Card */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4 border border-blue-300 text-3xl font-bold">
                👤
              </div>
              <h3 className="font-bold text-lg text-gray-800">{student.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{student.email || "No Email linked"}</p>
              
              <div className="w-full border-t border-gray-300 my-6"></div>

              <div className="w-full space-y-3.5 text-left text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Student Contact:</span>
                  <span className="font-bold text-gray-800">{student.contactNo || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Parent Contact:</span>
                  <span className="font-bold text-gray-800">{student.parentNo || "N/A"}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 font-semibold">Address:</span>
                  <span className="font-bold text-gray-800 text-right max-w-[150px] truncate">{student.address || "N/A"}</span>
                </div>
              </div>

              <div className="w-full border-t border-gray-300 my-6"></div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-2"
              >
                <span>{editMode ? "Cancel Editing" : "Edit Profile"}</span>
              </button>

              <button
                onClick={handleDeleteProfile}
                className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-2"
              >
                <span>Delete Profile</span>
              </button>
            </div>

            {/* Profile editing form */}
            <div className="bg-white rounded-xl border border-gray-300 p-8 shadow-lg md:col-span-2">
              <h2 className="text-xl font-bold text-blue-700 mb-6">Profile Settings</h2>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Contact Number</label>
                      <input
                        type="text"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Parent Contact Number</label>
                      <input
                        type="text"
                        value={parentNo}
                        onChange={(e) => setParentNo(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs text-gray-600 uppercase tracking-wider">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded transition text-sm"
                  >
                    Save Profile Changes
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  Click "Edit Profile" on the left card to update your profile data.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

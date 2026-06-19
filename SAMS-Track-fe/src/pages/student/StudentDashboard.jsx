import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { subjectService } from "../../services/subjectService";
import { marksService } from "../../services/marksService";
import { attendanceService } from "../../services/attendanceService";
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

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("studentId");
    navigate("/");
  };

  // Process chart data
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
    <div className="min-h-screen bg-[#fafafc] text-gray-900 font-sans">
      {/* Top sleeks header */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              S
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              SAMS-TRACK
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs bg-gray-50 text-gray-500 py-1.5 px-3 rounded-full border border-gray-100">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Logged in as: <strong className="text-gray-700">{loggedInUser}</strong> ({role.toUpperCase()})</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-rose-600 font-medium hover:bg-rose-50 px-3.5 py-2 rounded-xl transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
              {role === "parent" ? "Parent Access" : "Student Access"}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-gray-900">
              Welcome back, {student.name}!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {role === "parent" 
                ? "Monitoring your child's learning journey and academic evaluations."
                : "Track your academic journey, manage subjects, and visualize your progress."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-2xl font-bold text-indigo-600">{enrolledSubjects.length}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Enrolled Subjects</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {marks.length > 0 
                  ? (marks.reduce((acc, curr) => acc + curr.marks, 0) / marks.length).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">Avg Marks</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-2xl font-bold text-violet-600">{attendance.length}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Present Days</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl border border-emerald-100 text-sm font-medium flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 text-rose-700 px-5 py-3 rounded-2xl border border-rose-100 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Dashboard Tabs & Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
              activeTab === "progress" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Progress Graph & Marks</span>
          </button>
          
          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
              activeTab === "subjects" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Choose Subjects</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
              activeTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile settings</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "progress" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual self progress graph */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Self-Progress Chart</h2>
                  <p className="text-xs text-gray-400">Academic performance history</p>
                </div>

                {/* Graph View Toggle */}
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                  <button
                    onClick={() => setGraphView("weekly")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition duration-200 ${
                      graphView === "weekly" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setGraphView("monthly")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition duration-200 ${
                      graphView === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
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
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #f3f4f6', borderRadius: '12px' }}
                        labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" name="Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400">
                  No {graphView} progress records found yet
                </div>
              )}
            </div>

            {/* Read-Only Marks List */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Grades & Marks</h2>
                <p className="text-xs text-gray-400">All registered marks (Read Only)</p>
              </div>

              <div className="flex-grow overflow-y-auto max-h-[310px] space-y-3">
                {marks.length > 0 ? (
                  marks.map((m) => (
                    <div key={m.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-gray-800">{m.subject?.name || "Subject"}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <span>{m.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="capitalize">{m.term}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-600">{m.marks}</span>
                        <span className="text-xs text-gray-400 font-medium">/100</span>
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
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Enroll & Choose Subjects</h2>
              <p className="text-sm text-gray-400 mt-1">
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
                    className={`p-5 rounded-2xl border cursor-pointer transition duration-300 flex items-center justify-between group ${
                      isEnrolled 
                        ? "bg-indigo-50/60 border-indigo-200 text-indigo-900" 
                        : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/40"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-base">{sub.name}</div>
                      <div className="text-[11px] text-gray-400 mt-1 group-hover:text-indigo-500 transition">
                        {isEnrolled ? "✓ Enrolled" : "Click to enroll"}
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition duration-200 ${
                      isEnrolled 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-gray-200 group-hover:border-indigo-400"
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
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-600 mb-4">
                <UserIcon className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">{student.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{student.email || "No Email linked"}</p>
              
              <div className="w-full border-t border-gray-100 my-6"></div>

              <div className="w-full space-y-3.5 text-left text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Student Contact:</span>
                  <span className="font-bold text-gray-800">{student.contactNo || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Parent Contact:</span>
                  <span className="font-bold text-gray-800">{student.parentNo || "N/A"}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 font-medium">Address:</span>
                  <span className="font-bold text-gray-800 text-right max-w-[150px] truncate">{student.address || "N/A"}</span>
                </div>
              </div>

              <div className="w-full border-t border-gray-100 my-6"></div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold py-2.5 px-4 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editMode ? "Cancel Editing" : "Edit Profile"}</span>
              </button>

              <button
                onClick={handleDeleteProfile}
                className="w-full mt-3 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-2.5 px-4 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Profile</span>
              </button>
            </div>

            {/* Profile editing form */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Username</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Contact Number</label>
                      <input
                        type="text"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Parent Contact Number</label>
                      <input
                        type="text"
                        value={parentNo}
                        onChange={(e) => setParentNo(e.target.value)}
                        className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-bold text-xs text-gray-500 uppercase tracking-wider">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg shadow-indigo-100"
                  >
                    Save Profile Changes
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-3xl">
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

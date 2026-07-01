import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import { subjectService } from "../../services/subjectService";
import { userService } from "../../services/userService";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [facultyUsername, setFacultyUsername] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);

  const fetchSubjectsAndFaculties = () => {
    setLoading(true);
    Promise.all([subjectService.getAll(), userService.getAllFaculty()])
      .then(([subData, facData]) => {
        setSubjects(subData || []);
        setFaculties(facData || []);
      })
      .catch((err) => console.error("Error fetching subjects/faculties:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubjectsAndFaculties();
  }, []);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subjectName || subjectName.trim() === "") return;

    subjectService.add(subjectName, facultyUsername)
      .then(() => {
        alert("Subject added successfully!");
        setShowAddModal(false);
        setSubjectName("");
        setFacultyUsername("");
        fetchSubjectsAndFaculties();
      })
      .catch((err) => console.error("Error adding subject:", err));
  };

  const startEditSubject = (subject) => {
    setCurrentSubject(subject);
    setSubjectName(subject.name || "");
    setFacultyUsername(subject.facultyUsername || "");
    setShowEditModal(true);
  };

  const handleEditSubject = (e) => {
    e.preventDefault();
    if (!subjectName || subjectName.trim() === "" || !currentSubject) return;

    subjectService.update(currentSubject.id, subjectName, facultyUsername)
      .then(() => {
        alert("Subject updated successfully!");
        setShowEditModal(false);
        setSubjectName("");
        setFacultyUsername("");
        setCurrentSubject(null);
        fetchSubjectsAndFaculties();
      })
      .catch((err) => console.error("Error updating subject:", err));
  };

  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    subjectService.delete(id)
      .then(() => {
        alert("Subject deleted successfully!");
        fetchSubjectsAndFaculties();
      })
      .catch((err) => console.error("Error deleting subject:", err));
  };

  const getFacultyName = (uname) => {
    if (!uname) return "Unassigned";
    const fac = faculties.find((f) => f.username === uname);
    return fac ? `${fac.firstName || ''} ${fac.lastName || ''}`.trim() || fac.username : uname;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Course Subjects</h1>
            <p className="text-sm text-gray-600">Manage curriculum, subject codes, and assigned faculty</p>
          </div>
          <button
            onClick={() => {
              setSubjectName("");
              setFacultyUsername("");
              setShowAddModal(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition"
          >
            + Add New Subject
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 font-medium">Loading subjects...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                    <th className="p-3 text-center w-12">#</th>
                    <th className="p-3 text-center w-20">ID</th>
                    <th className="p-3">Subject Name</th>
                    <th className="p-3">Assigned Faculty</th>
                    <th className="p-3 text-center w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="p-3 text-center text-gray-500">{index + 1}</td>
                        <td className="p-3 text-center text-gray-600 font-medium">{subject.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{subject.name}</td>
                        <td className="p-3 text-gray-700">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${subject.facultyUsername ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                            {getFacultyName(subject.facultyUsername)}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => startEditSubject(subject)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSubject(subject.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                        No subjects registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <div key={subject.id} className="bg-white p-4 rounded border border-gray-300 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{subject.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Subject ID: {subject.id}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span className="font-semibold text-gray-500">Faculty:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${subject.facultyUsername ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                        {getFacultyName(subject.facultyUsername)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1 border-t pt-3 border-gray-100 justify-end">
                      <button
                        onClick={() => startEditSubject(subject)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex-1 transition text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex-1 transition text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded border border-gray-300 text-gray-500 text-sm shadow-sm">
                  No subjects registered.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-gray-300 p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-800 text-base mb-4 border-b pb-2 border-gray-200">Add New Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Computer Networks"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Assign Faculty</label>
                <select
                  value={facultyUsername}
                  onChange={(e) => setFacultyUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="">-- Select Faculty (Optional) --</option>
                  {faculties.map((f) => (
                    <option key={f.username} value={f.username}>
                      {f.firstName} {f.lastName} ({f.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-xs font-semibold transition shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-gray-300 p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-800 text-base mb-4 border-b pb-2 border-gray-200">Edit Subject Details</h3>
            <form onSubmit={handleEditSubject}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Assign Faculty</label>
                <select
                  value={facultyUsername}
                  onChange={(e) => setFacultyUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="">-- Select Faculty (Optional) --</option>
                  {faculties.map((f) => (
                    <option key={f.username} value={f.username}>
                      {f.firstName} {f.lastName} ({f.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentSubject(null);
                    setSubjectName("");
                    setFacultyUsername("");
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-xs font-semibold transition shadow-sm"
                >
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSubject;

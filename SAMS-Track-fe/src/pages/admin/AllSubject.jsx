import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import { subjectService } from "../../services/subjectService";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);

  const fetchSubjects = () => {
    setLoading(true);
    subjectService.getAll()
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subjectName || subjectName.trim() === "") return;

    subjectService.add(subjectName)
      .then(() => {
        alert("Subject added successfully!");
        setShowAddModal(false);
        setSubjectName("");
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  const startEditSubject = (subject) => {
    setCurrentSubject(subject);
    setSubjectName(subject.name);
    setShowEditModal(true);
  };

  const handleEditSubject = (e) => {
    e.preventDefault();
    if (!subjectName || subjectName.trim() === "" || !currentSubject) return;

    subjectService.update(currentSubject.id, subjectName, currentSubject.facultyUsername)
      .then(() => {
        alert("Subject updated successfully!");
        setShowEditModal(false);
        setSubjectName("");
        setCurrentSubject(null);
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    subjectService.delete(id)
      .then(() => {
        alert("Subject deleted successfully!");
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <AdminMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Course Subjects</h1>
            <p className="text-sm text-gray-600">Manage curriculum and subjects offered</p>
          </div>
          <button
            onClick={() => {
              setSubjectName("");
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
          <div className="overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                  <th className="p-3 text-center w-12">#</th>
                  <th className="p-3 text-center w-20">ID</th>
                  <th className="p-3">Subject Name</th>
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
                    <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">
                      No subjects registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <h3 className="font-bold text-gray-800 text-base mb-4 border-b pb-2 border-gray-200">Edit Subject</h3>
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
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentSubject(null);
                    setSubjectName("");
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


import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import { subjectService } from "../../services/subjectService";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);

  // fetch subjects
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

  // add subject
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

  // start editing
  const startEditSubject = (subject) => {
    setCurrentSubject(subject);
    setSubjectName(subject.name);
    setShowEditModal(true);
  };

  // edit subject
  const handleEditSubject = (e) => {
    e.preventDefault();
    if (!subjectName || subjectName.trim() === "" || !currentSubject) return;

    subjectService.update(currentSubject.id, subjectName)
      .then(() => {
        alert("Subject updated successfully!");
        setShowEditModal(false);
        setSubjectName("");
        setCurrentSubject(null);
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  // delete subject
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      <AdminMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">All Subjects</h2>
          <button
            onClick={() => {
              setSubjectName("");
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition"
          >
            Add Subject
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4 border border-gray-300">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border px-4 py-2 text-center w-16">#</th>
                  <th className="border px-4 py-2 text-center w-24">ID</th>
                  <th className="border px-4 py-2">Subject Name</th>
                  <th className="border px-4 py-2 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 text-center text-gray-500">{index + 1}</td>
                      <td className="border px-4 py-2 text-center text-gray-500">{subject.id}</td>
                      <td className="border px-4 py-2 font-medium text-gray-700">{subject.name}</td>
                      <td className="border px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => startEditSubject(subject)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500 border">
                      No subjects found.
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-gray-300">
            <h3 className="font-bold text-lg text-blue-600 mb-4">Add Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-gray-300">
            <h3 className="font-bold text-lg text-blue-600 mb-4">Edit Subject</h3>
            <form onSubmit={handleEditSubject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentSubject(null);
                    setSubjectName("");
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Update
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

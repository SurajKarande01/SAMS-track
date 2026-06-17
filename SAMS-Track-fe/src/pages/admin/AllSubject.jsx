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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminMenu />

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800">All Subjects</h2>
          <button
            onClick={() => {
              setSubjectName("");
              setShowAddModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition font-medium shadow-sm"
          >
            Add Subject
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto border rounded border-gray-200 bg-white max-w-4xl mx-auto shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border-b p-3 text-center w-16">#</th>
                  <th className="border-b p-3 text-center w-24">ID</th>
                  <th className="border-b p-3 text-left">Subject Name</th>
                  <th className="border-b p-3 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="border-b p-3 text-center text-gray-500">{index + 1}</td>
                      <td className="border-b p-3 text-center text-gray-500">{subject.id}</td>
                      <td className="border-b p-3 font-medium text-gray-700">{subject.name}</td>
                      <td className="border-b p-3 text-center space-x-2">
                        <button
                          onClick={() => startEditSubject(subject)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
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
                    <td colSpan="4" className="text-center p-4 text-gray-500">
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
          <div className="bg-white rounded p-6 w-96 shadow-lg border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Add Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition font-medium"
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
          <div className="bg-white rounded p-6 w-96 shadow-lg border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Edit Subject</h3>
            <form onSubmit={handleEditSubject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition font-medium"
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

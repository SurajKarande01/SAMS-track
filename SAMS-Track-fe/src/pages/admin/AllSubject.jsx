import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu";
import { subjectService } from "../../services/subjectService";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const addSubject = () => {
    const name = prompt("Enter subject name:");
    if (!name || name.trim() === "") return;

    subjectService.add(name)
      .then(() => {
        alert("Subject added!");
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  // edit subject
  const editSubject = (id, oldName) => {
    const newName = prompt("Enter new name:", oldName);
    if (!newName || newName.trim() === "") return;

    subjectService.update(id, newName)
      .then(() => {
        alert("Subject updated!");
        fetchSubjects();
      })
      .catch((err) => console.error("Error:", err));
  };

  // delete subject
  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    subjectService.delete(id)
      .then(() => {
        alert("Subject deleted!");
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
            onClick={addSubject}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition font-medium"
          >
            Add Subject
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto border rounded border-gray-200 bg-white max-w-4xl mx-auto">
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
                      <td className="border-b p-3 text-center">{index + 1}</td>
                      <td className="border-b p-3 text-center">{subject.id}</td>
                      <td className="border-b p-3">{subject.name}</td>
                      <td className="border-b p-3 text-center space-x-2">
                        <button
                          onClick={() => editSubject(subject.id, subject.name)}
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
    </div>
  );
}

export default AllSubject;

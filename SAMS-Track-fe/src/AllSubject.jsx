import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);

  // fetch subjects
  const fetchSubjects = () => {
    fetch("http://localhost:8091/subject/get-all-subjects/")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // add subject
  const addSubject = () => {
    const name = prompt("Enter subject name:");
    if (!name || name.trim() === "") return;

    fetch("http://localhost:8091/subject/add-subject/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Subject added!");
          fetchSubjects();
        } else {
          alert("Failed to add subject.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // edit subject
  const editSubject = (id, oldName) => {
    const newName = prompt("Enter new name:", oldName);
    if (!newName || newName.trim() === "") return;

    fetch("http://localhost:8091/subject/update-subject/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: newName }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Subject updated!");
          fetchSubjects();
        } else {
          alert("Failed to update.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // delete subject
  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    fetch(`http://localhost:8091/subject/delete-subject/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Subject deleted!");
          fetchSubjects();
        } else {
          alert("Failed to delete.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Subjects</h2>
          <button
            onClick={addSubject}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Subject
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">ID</th>
              <th className="border p-2">Subject Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <tr key={subject.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{subject.id}</td>
                  <td className="border p-2">{subject.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => editSubject(subject.id, subject.name)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
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
    </div>
  );
}

export default AllSubject;

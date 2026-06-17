import { useEffect, useState } from "react";
import FacultyMenu from "./FacultyMenu";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // fetch students
  useEffect(() => {
    fetch("http://localhost:8091/student/get-all-students/")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  // delete student
  const deleteStudent = (id) => {
    if (!window.confirm("Delete this student?")) return;

    fetch(`http://localhost:8091/student/delete-student/${id}/`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents(students.filter((s) => s.id !== id));
      })
      .catch((err) => console.error("Error:", err));
  };

  // start editing
  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditEmail(student.email);
  };

  // save edit
  const saveEdit = () => {
    fetch("http://localhost:8091/student/update-student/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, name: editName, email: editEmail }),
    })
      .then(() => {
        setStudents(
          students.map((s) =>
            s.id === editingId ? { ...s, name: editName, email: editEmail } : s
          )
        );
        setEditingId(null);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FacultyMenu />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">All Students</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border p-2">{student.id}</td>
                  <td className="border p-2">
                    {editingId === student.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-1 rounded"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === student.id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="border p-1 rounded"
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === student.id ? (
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(student)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteStudent(student.id)}
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
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllStudents;

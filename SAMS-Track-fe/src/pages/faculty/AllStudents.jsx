import { useEffect, useState } from "react";
import FacultyMenu from "../../components/FacultyMenu";
import { studentService } from "../../services/studentService";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch students
  const fetchStudents = () => {
    setLoading(true);
    studentService.getAll()
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // delete student
  const deleteStudent = (id) => {
    if (!window.confirm("Delete this student?")) return;

    studentService.delete(id)
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
    studentService.update({ id: editingId, name: editName, email: editEmail })
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
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex flex-col">
      <FacultyMenu />

      <div className="p-6 max-w-4xl mx-auto flex-grow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">All Students</h2>

        {loading ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4 border border-gray-300">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border px-4 py-2 text-center w-24">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 text-center">{student.id}</td>
                      <td className="border px-4 py-2">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        ) : (
                          student.name
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editingId === student.id ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        ) : (
                          student.email
                        )}
                      </td>
                      <td className="border px-4 py-2 text-center space-x-2">
                        {editingId === student.id ? (
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500 border">
                      No students found
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

export default AllStudents;

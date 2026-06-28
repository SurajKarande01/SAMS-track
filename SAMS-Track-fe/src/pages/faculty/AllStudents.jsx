import { useEffect, useState } from "react";
import FacultyMenu from "../../components/FacultyMenu";
import { studentService } from "../../services/studentService";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);

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

  const deleteStudent = (id) => {
    if (!window.confirm("Delete this student profile?")) return;

    studentService.delete(id)
      .then(() => {
        setStudents(students.filter((s) => s.id !== id));
      })
      .catch((err) => console.error("Error:", err));
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditEmail(student.email);
  };

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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <FacultyMenu />

      <div className="p-6 max-w-5xl mx-auto flex-grow w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Registered Students</h1>
          <p className="text-sm text-gray-600">Student Directory and enrollment roster</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 font-medium">Loading student list...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded border border-gray-300 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-300">
                  <th className="p-3 text-center w-16">ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center text-gray-600 font-medium">{student.id}</td>
                      <td className="p-3 font-semibold text-gray-800">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                          />
                        ) : (
                          student.name
                        )}
                      </td>
                      <td className="p-3 text-gray-600">
                        {editingId === student.id ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                          />
                        ) : (
                          student.email
                        )}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        {editingId === student.id ? (
                          <button
                            onClick={saveEdit}
                            className="bg-green-700 hover:bg-green-800 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteStudent(student.id)}
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
                      No students enrolled.
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


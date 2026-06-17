import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import FacultyMenu from "./FacultyMenu";

function Profile() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", firstName: "", lastName: "", email: "", role: "" });

  useEffect(() => {
    fetch(`http://localhost:8091/user/get-user-by-username/${username}/`)
      .then((res) => res.json())
      .then((data) => { setUser(data); setForm(data); })
      .catch((err) => console.error(err));
  }, [username]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSave = () => {
    fetch("http://localhost:8091/user/update-user/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then((data) => { alert("Profile updated!"); setUser(data); setIsEditing(false); })
      .catch(() => alert("Error updating profile."));
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="flex justify-center py-10 px-4">
        <div className="bg-white p-6 rounded shadow w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4 text-center">My Profile</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" value={form.username} disabled className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} disabled={!isEditing} className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} disabled={!isEditing} className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} disabled={!isEditing} className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Role</label>
            <input type="text" value={form.role} disabled className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
            ) : (
              <>
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => { setIsEditing(false); setForm(user); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

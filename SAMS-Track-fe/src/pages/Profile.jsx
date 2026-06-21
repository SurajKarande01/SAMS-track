import { useEffect, useState } from "react";
import AdminMenu from "../components/AdminMenu";
import FacultyMenu from "../components/FacultyMenu";
import { userService } from "../services/userService";

function Profile() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", firstName: "", lastName: "", email: "", role: "" });

  useEffect(() => {
    userService.getByUsername(username)
      .then((data) => { setUser(data); setForm(data); })
      .catch((err) => console.error(err));
  }, [username]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSave = () => {
    userService.update(form)
      .then((data) => { alert("Profile updated!"); setUser(data); setIsEditing(false); })
      .catch(() => alert("Error updating profile."));
  };

  if (!user) return <div className="p-6">Loading...</div>;

  const getBackgroundClass = () => {
    if (role === "admin") return "bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200";
    if (role === "faculty") return "bg-gradient-to-br from-green-200 via-blue-200 to-purple-200";
    return "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200";
  };

  const getHeaderColor = () => {
    if (role === "admin") return "text-blue-700";
    if (role === "faculty") return "text-green-700";
    return "text-indigo-700";
  };

  const getButtonClass = () => {
    if (role === "admin") return "bg-blue-600 hover:bg-blue-700";
    if (role === "faculty") return "bg-green-600 hover:bg-green-700";
    return "bg-indigo-600 hover:bg-indigo-700";
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} flex flex-col`}>
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="flex-grow flex justify-center py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg flex flex-col gap-4 border">
          <h2 className={`text-2xl font-bold text-center ${getHeaderColor()}`}>My Profile</h2>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input type="text" value={form.username} disabled className="border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} disabled={!isEditing} className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} disabled={!isEditing} className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} disabled={!isEditing} className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input type="text" value={form.role} disabled className="border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className={`${getButtonClass()} text-white px-4 py-2 rounded font-semibold transition`}>Edit</button>
            ) : (
              <>
                <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition">Save</button>
                <button onClick={() => { setIsEditing(false); setForm(user); }} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

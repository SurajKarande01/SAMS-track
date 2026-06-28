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

  if (!user) return <div className="p-6 text-center text-gray-600">Loading profile data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}
      <div className="flex-grow flex justify-center py-10 px-4">
        <div className="bg-white p-8 rounded border border-gray-300 shadow-sm w-full max-w-lg flex flex-col gap-4">
          <div className="border-b pb-3 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">My Profile Account</h2>
            <p className="text-xs text-gray-600">View and update your registered account information</p>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Username (Read Only)</label>
            <input type="text" value={form.username} disabled className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">First Name</label>
              <input type="text" name="firstName" value={form.firstName || ""} onChange={handleChange} disabled={!isEditing} className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase">Last Name</label>
              <input type="text" name="lastName" value={form.lastName || ""} onChange={handleChange} disabled={!isEditing} className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
            <input type="email" name="email" value={form.email || ""} onChange={handleChange} disabled={!isEditing} className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
            <input type="password" name="password" value={form.password || ""} onChange={handleChange} disabled={!isEditing} className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"}`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase">Account Role (Read Only)</label>
            <input type="text" value={form.role} disabled className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed uppercase font-semibold" />
          </div>

          <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-gray-200">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded text-sm font-semibold transition shadow-sm">Edit Profile</button>
            ) : (
              <>
                <button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded text-sm font-semibold transition shadow-sm">Save Changes</button>
                <button onClick={() => { setIsEditing(false); setForm(user); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-semibold transition">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


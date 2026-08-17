import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateRole(id, currentRole) {
    try {
      const nextRole = currentRole === "admin" ? "user" : "admin";
      await api.put(`/admin/users/${id}`, { role: nextRole });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white px-8 py-8 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900">Admin Users</h1>
            <p className="mt-2 text-sm text-slate-500">Manage customer accounts and admin access.</p>
          </div>

          <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
            {users.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-50 p-14 text-center text-slate-500 shadow-sm">
                No users found.
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="text-sm text-slate-500">{user.phone || "No phone"}</p>
                        <p className="text-sm text-slate-500">Role: {user.role}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => updateRole(user._id, user.role)}
                          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminUsers;

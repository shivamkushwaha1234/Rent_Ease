import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useSelector } from "react-redux";

function Support() {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ title: "", description: "", order: "", product: "", type: "Maintenance" });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      if (!user?._id) return;
      try {
        const res = await api.get(`/maintenance/user/${user._id}`);
        setRequests(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRequests();
  }, [user?._id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/maintenance", { ...form, user: user._id });
      setForm({ title: "", description: "", order: "", product: "", type: "Maintenance" });
      const res = await api.get(`/maintenance/user/${user._id}`);
      setRequests(res.data);
      toast.success("Maintenance request created.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create request.");
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">Please login to access support.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
            <h1 className="text-3xl font-semibold text-slate-900">Support / Maintenance</h1>
            <p className="mt-2 text-sm text-slate-500">Create and track maintenance requests for your active rentals.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4">Create Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full rounded-3xl border border-slate-200 px-5 py-3" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows="4" className="w-full rounded-3xl border border-slate-200 px-5 py-3" required />
                <div className="grid gap-4 md:grid-cols-3">
                  <input name="order" value={form.order} onChange={handleChange} placeholder="Order ID (optional)" className="w-full rounded-3xl border border-slate-200 px-5 py-3" />
                  <input name="product" value={form.product} onChange={handleChange} placeholder="Product ID (optional)" className="w-full rounded-3xl border border-slate-200 px-5 py-3" />
                  <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900">
                    <option value="Maintenance">Maintenance</option>
                    <option value="Damage">Damage</option>
                    <option value="Dispute">Dispute</option>
                  </select>
                </div>
                <button type="submit" className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-white">Create</button>
              </form>
            </div>

            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
              {requests.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No requests yet.</div>
              ) : (
                <div className="space-y-4">
                  {requests.map((r) => (
                    <div key={r._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <p className="font-semibold">{r.title}</p>
                      <p className="text-sm text-slate-500">{r.description}</p>
                      <p className="text-sm text-slate-500">Type: {r.type || "Maintenance"}</p>
                      <p className="text-sm text-slate-500">Status: {r.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Support;

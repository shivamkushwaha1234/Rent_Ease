import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    order: "",
    product: "",
    type: "Maintenance",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await api.get("/admin/maintenance");
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/admin/maintenance", form);
      setForm({ title: "", description: "", order: "", product: "", type: "Maintenance" });
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Unable to create maintenance request.");
    }
  }

  async function updateRequest(id, status) {
    try {
      await api.put(`/admin/maintenance/${id}`, { status });
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900">Maintenance Requests</h1>
            <p className="mt-2 text-sm text-slate-500">Track service issues and resolve damage or support tickets.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                <div className="grid gap-4 md:grid-cols-3">
                  <input name="order" value={form.order} onChange={handleChange} placeholder="Order ID (optional)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" />
                  <input name="product" value={form.product} onChange={handleChange} placeholder="Product ID (optional)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" />
                  <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900">
                    <option value="Maintenance">Maintenance</option>
                    <option value="Damage">Damage</option>
                    <option value="Dispute">Dispute</option>
                  </select>
                </div>
                <button type="submit" className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Create Request</button>
              </form>
            </div>

            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Request List</h2>
              {requests.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No requests found.</div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{request.title}</p>
                          <p className="text-sm text-slate-500">{request.description}</p>
                          <p className="text-sm text-slate-500">Type: {request.type}</p>
                          <p className="text-sm text-slate-500">Status: {request.status}</p>
                        </div>
                        <select value={request.status} onChange={(e) => updateRequest(request._id, e.target.value)} className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none">
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
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

export default MaintenanceRequests;

import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiBriefcase, FiMapPin } from "react-icons/fi";
import { toast } from "react-hot-toast";

function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    skillType: "Logistics & Delivery",
    servicesOffered: "Express Delivery, Installation, Routine Servicing",
    description: "",
    serviceArea: "All Cities",
    contactEmail: "",
    active: true,
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/providers");
      setProviders(res.data || []);
    } catch (err) {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      skillType: "Logistics & Delivery",
      servicesOffered: "Express Delivery, Free Setup, Maintenance",
      description: "",
      serviceArea: "All Cities",
      contactEmail: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (provider) => {
    setEditingId(provider._id);
    setFormData({
      name: provider.name || "",
      skillType: provider.skillType || "Logistics & Delivery",
      servicesOffered: Array.isArray(provider.servicesOffered)
        ? provider.servicesOffered.join(", ")
        : provider.servicesOffered || "",
      description: provider.description || "",
      serviceArea: provider.serviceArea || "All Cities",
      contactEmail: provider.contactEmail || "",
      active: provider.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        servicesOffered: formData.servicesOffered
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/providers/${editingId}`, payload);
        toast.success("Provider updated successfully");
      } else {
        await api.post("/providers", payload);
        toast.success("Provider added successfully");
      }

      setIsModalOpen(false);
      fetchProviders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) return;
    try {
      await api.delete(`/providers/${id}`);
      toast.success("Provider removed");
      fetchProviders();
    } catch (err) {
      toast.error("Failed to delete provider");
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <FiBriefcase className="h-3.5 w-3.5" /> Admin Vendor Operations
              </span>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage Service Providers</h1>
              <p className="mt-1 text-sm text-slate-500">
                Add and update certified vendors, delivery partners, and maintenance service providers.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <FiPlus className="h-5 w-5" /> Add New Provider
            </button>
          </div>

          {/* Table of Providers */}
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-4 text-sm font-medium">Loading providers list...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
              <p className="text-slate-500">No service providers created yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100/70 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Provider Name</th>
                      <th className="px-6 py-4">Skill / Category</th>
                      <th className="px-6 py-4">Service Area</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Services Offered</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {providers.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {p.skillType || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 flex items-center gap-1">
                          <FiMapPin className="h-3.5 w-3.5 text-slate-400" /> {p.serviceArea || "All"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{p.contactEmail || "—"}</td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(p.servicesOffered)
                              ? p.servicesOffered.slice(0, 3).map((s, i) => (
                                  <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                    {s}
                                  </span>
                                ))
                              : p.servicesOffered || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {p.active ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                              <FiCheck className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-200">
                              <FiX className="h-3 w-3" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition"
                              title="Edit Provider"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Provider"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Service Provider" : "Add Service Provider"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Provider / Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ExpressRelo Logistics"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Skill / Specialization</label>
                  <input
                    type="text"
                    value={formData.skillType}
                    onChange={(e) => setFormData({ ...formData, skillType: e.target.value })}
                    placeholder="e.g. Appliance Repair"
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Service Area</label>
                  <input
                    type="text"
                    value={formData.serviceArea}
                    onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                    placeholder="e.g. Mumbai, Delhi, All Cities"
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="vendor@rentease.com"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Services Offered (comma separated)</label>
                <input
                  type="text"
                  value={formData.servicesOffered}
                  onChange={(e) => setFormData({ ...formData, servicesOffered: e.target.value })}
                  placeholder="Express Delivery, Free Installation, Maintenance"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary of services provided..."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="activeCheck" className="text-xs font-medium text-slate-700">Active Provider</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
                >
                  {editingId ? "Save Changes" : "Create Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AdminProviders;

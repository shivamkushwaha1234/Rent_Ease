import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    activeRentals: 0,
    utilizationRate: 0,
    customerRetentionRate: 0,
    averageResolutionDays: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white px-8 py-8 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Overview of users, products, orders, and revenue.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.75rem] bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/10">
              <p className="text-sm uppercase tracking-[0.2em]">Total Users</p>
              <p className="mt-4 text-3xl font-semibold">{stats.totalUsers}</p>
            </div>
            <div className="rounded-[1.75rem] bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-600/10">
              <p className="text-sm uppercase tracking-[0.2em]">Products</p>
              <p className="mt-4 text-3xl font-semibold">{stats.totalProducts}</p>
            </div>
            <div className="rounded-[1.75rem] bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-600/10">
              <p className="text-sm uppercase tracking-[0.2em]">Orders</p>
              <p className="mt-4 text-3xl font-semibold">{stats.totalOrders}</p>
            </div>
            <div className="rounded-[1.75rem] bg-orange-500 p-6 text-white shadow-lg shadow-orange-500/10">
              <p className="text-sm uppercase tracking-[0.2em]">Revenue</p>
              <p className="mt-4 text-3xl font-semibold">₹{stats.revenue}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/10">
              <p className="text-sm uppercase tracking-[0.2em]">Active Rentals</p>
              <p className="mt-4 text-3xl font-semibold">{stats.activeRentals}</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-700 p-6 text-white shadow-lg shadow-slate-700/10">
              <p className="text-sm uppercase tracking-[0.2em]">Utilization Rate</p>
              <p className="mt-4 text-3xl font-semibold">{stats.utilizationRate}%</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-600 p-6 text-white shadow-lg shadow-slate-600/10">
              <p className="text-sm uppercase tracking-[0.2em]">Customer Retention</p>
              <p className="mt-4 text-3xl font-semibold">{stats.customerRetentionRate}%</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-500 p-6 text-white shadow-lg shadow-slate-500/10">
              <p className="text-sm uppercase tracking-[0.2em]">Avg. Resolution (days)</p>
              <p className="mt-4 text-3xl font-semibold">{stats.averageResolutionDays}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard;

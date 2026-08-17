import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateUser } from "../redux/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiPackage,
  FiClock,
  FiTool,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiCalendar,
  FiPlusCircle,
  FiArrowRight
} from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [orders, setOrders] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // New Maintenance modal form state
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintForm, setMaintForm] = useState({
    title: "",
    description: "",
    type: "Maintenance",
    order: "",
  });

  useEffect(() => {
    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    async function fetchProfileData() {
      try {
        setLoading(true);
        const [profileRes, ordersRes, maintenanceRes] = await Promise.all([
          api.get("/auth/profile").catch(() => ({ data: authUser })),
          api.get(`/orders/user/${authUser._id}`).catch(() => ({ data: [] })),
          api.get(`/maintenance/user/${authUser._id}`).catch(() => ({ data: [] })),
        ]);

        const pData = profileRes.data || authUser;
        setProfile({
          name: pData.name || "",
          email: pData.email || "",
          phone: pData.phone || "",
          address: pData.address || "",
          role: pData.role || "user",
        });

        setOrders(ordersRes.data || []);
        setMaintenanceRequests(maintenanceRes.data || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Unable to fetch complete profile data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [navigate, authUser?._id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put("/auth/profile", {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });

      dispatch(updateUser(res.data));
      toast.success("Profile details updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setSavingPassword(true);
      await api.put("/auth/profile", {
        password: passwordData.newPassword,
      });
      setPasswordData({ newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    try {
      await api.post("/maintenance", {
        ...maintForm,
        user: authUser._id,
      });
      toast.success("Support ticket submitted successfully.");
      setShowMaintModal(false);
      setMaintForm({ title: "", description: "", type: "Maintenance", order: "" });

      // Refresh tickets
      const res = await api.get(`/maintenance/user/${authUser._id}`);
      setMaintenanceRequests(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to submit support ticket.");
    }
  };

  const activeRentals = orders.filter((o) => ["Approved", "Delivered"].includes(o.status));
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const totalDeposits = orders.reduce((sum, o) => sum + (o.depositAmount || 0), 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 gap-4">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600">Loading your profile dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Main User Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-6 z-10">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-3xl font-black uppercase text-white shadow-lg shadow-indigo-600/40 border border-white/20">
                {profile.name?.[0] || "U"}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold tracking-tight">{profile.name || "Valued User"}</h1>
                  <span className="rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold uppercase text-indigo-300 border border-indigo-400/30">
                    {profile.role}
                  </span>
                </div>
                <p className="mt-1.5 text-slate-300 text-sm flex items-center gap-2">
                  <FiMail className="h-4 w-4 text-indigo-400" /> {profile.email}
                </p>
                {profile.phone && (
                  <p className="mt-1 text-slate-400 text-xs flex items-center gap-2">
                    <FiPhone className="h-3.5 w-3.5 text-indigo-400" /> {profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur border border-white/10 w-full lg:w-auto z-10">
              <div className="text-center px-3 py-1.5 border-r border-white/10 last:border-r-0 sm:last:border-r">
                <p className="text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1">
                  <FiPackage className="h-3.5 w-3.5 text-indigo-400" /> Orders
                </p>
                <p className="text-xl font-black text-white mt-0.5">{orders.length}</p>
              </div>
              <div className="text-center px-3 py-1.5 border-r border-white/10 last:border-r-0">
                <p className="text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1">
                  <FiClock className="h-3.5 w-3.5 text-emerald-400" /> Active
                </p>
                <p className="text-xl font-black text-emerald-300 mt-0.5">{activeRentals.length}</p>
              </div>
              <div className="text-center px-3 py-1.5 border-r border-white/10 last:border-r-0">
                <p className="text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1">
                  <FiDollarSign className="h-3.5 w-3.5 text-amber-400" /> Deposits
                </p>
                <p className="text-xl font-black text-amber-300 mt-0.5">₹{totalDeposits}</p>
              </div>
              <div className="text-center px-3 py-1.5">
                <p className="text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1">
                  <FiTool className="h-3.5 w-3.5 text-cyan-400" /> Tickets
                </p>
                <p className="text-xl font-black text-cyan-300 mt-0.5">{maintenanceRequests.length}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-semibold overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FiUser className="h-4 w-4" /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeTab === "rentals"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FiPackage className="h-4 w-4" /> My Rentals & History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeTab === "support"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FiTool className="h-4 w-4" /> Maintenance & Support ({maintenanceRequests.length})
            </button>
          </div>

          {/* TAB 1: Personal Information */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Details Form */}
              <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-6">
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                  <FiUser className="h-5 w-5 text-indigo-600" /> Account Profile & Address
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <FiUser className="h-3.5 w-3.5 text-indigo-600" /> Full Name
                      </label>
                      <input
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <FiPhone className="h-3.5 w-3.5 text-indigo-600" /> Phone Number
                      </label>
                      <input
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <FiMail className="h-3.5 w-3.5 text-indigo-600" /> Email Address (Read-only)
                    </label>
                    <input
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <FiMapPin className="h-3.5 w-3.5 text-indigo-600" /> Delivery & Shipping Address
                    </label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      rows="3"
                      placeholder="Street address, Flat No., City, Pincode"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-6">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {savingProfile ? "Saving..." : "Save Profile Details"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Sidebar */}
              <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-6 h-fit">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                  <FiLock className="h-5 w-5 text-indigo-600" /> Update Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-50 mt-2"
                  >
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: My Rentals & History */}
          {activeTab === "rentals" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Active & Past Rentals</h2>
                  <p className="text-xs text-slate-500 mt-1">Manage ongoing tenures, request pickups, and view receipts.</p>
                </div>
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View Full Orders Page <FiArrowRight />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
                  <FiPackage className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="text-base font-semibold text-slate-700">No rental orders placed yet.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Explore our top furniture and appliance collections and place your first monthly subscription!
                  </p>
                  <Link
                    to="/products"
                    className="inline-block rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition mt-2"
                  >
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID:</span>
                            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">{order._id}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1"><FiCalendar className="h-3.5 w-3.5 text-indigo-600" /> Delivery: {order.deliveryDate || "N/A"}</span>
                            <span className="flex items-center gap-1"><FiClock className="h-3.5 w-3.5 text-indigo-600" /> Return: {order.returnDate || "TBD"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                              order.status === "Delivered" || order.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                            Total: ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <img
                              src={item.product?.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300"}
                              alt={item.product?.name || "Rental product"}
                              className="h-14 w-14 rounded-xl object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{item.product?.name || "Product"}</h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Tenure: <span className="font-semibold text-slate-700">{item.tenure || 3} Months</span> | Qty: {item.quantity}
                              </p>
                              <p className="text-[11px] font-bold text-indigo-600 mt-0.5">₹{item.product?.monthlyRent || 0}/mo</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Maintenance & Support Tickets */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Maintenance & Maintenance Tickets</h2>
                  <p className="text-xs text-slate-500 mt-1">Submit damage claims, request repairs, or ask service questions.</p>
                </div>
                <button
                  onClick={() => setShowMaintModal(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  <FiPlusCircle className="h-4 w-4" /> Raise Maintenance Ticket
                </button>
              </div>

              {maintenanceRequests.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
                  <FiTool className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="text-base font-semibold text-slate-700">No active maintenance requests.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    If any furniture or appliance requires repair, maintenance, or inspection, submit a request here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {maintenanceRequests.map((req) => (
                    <div key={req._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            {req.type || "Maintenance"}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-2">{req.title}</h3>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            req.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {req.status || "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {req.description}
                      </p>
                      {req.order && (
                        <p className="text-[11px] text-slate-400">Order Ref: <span className="font-mono font-semibold text-slate-600">{req.order}</span></p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* New Ticket Modal */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="rounded-3xl bg-white p-8 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FiTool className="h-5 w-5 text-indigo-600" /> New Support / Maintenance Ticket
            </h3>

            <form onSubmit={handleCreateMaintenance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  value={maintForm.title}
                  onChange={(e) => setMaintForm({ ...maintForm, title: e.target.value })}
                  placeholder="e.g. Fridge Cooling Issue / Table Leg Loose"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Type</label>
                <select
                  value={maintForm.type}
                  onChange={(e) => setMaintForm({ ...maintForm, type: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="Maintenance">Regular Maintenance / Repair</option>
                  <option value="Damage">Damage Claim</option>
                  <option value="Dispute">Dispute / Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  value={maintForm.description}
                  onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })}
                  rows="3"
                  placeholder="Please describe the issue or support request in detail..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMaintModal(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Submit Ticket
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

export default Profile;

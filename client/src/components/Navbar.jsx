import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiShield,
  FiTruck,
  FiUser,
  FiHelpCircle,
  FiTool,
  FiUsers,
  FiGrid
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

import { useState, useEffect } from "react";
import api from "../services/api";

function Navbar() {
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user") || "null");
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchCartCount() {
      if (!user?._id) {
        setCartCount(0);
        return;
      }
      try {
        const res = await api.get(`/cart/${user._id}`);
        const total = res.data.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCartCount();
  }, [user?._id, location.pathname]);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
      isActive(path)
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg">
            R
          </span>
          Rent<span className="text-indigo-600">Ease</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-1">
          <Link to="/" className={linkStyle("/")}>
            <FiHome className="h-3.5 w-3.5" /> Home
          </Link>
          <Link to="/products" className={linkStyle("/products")}>
            <FiBox className="h-3.5 w-3.5" /> Products
          </Link>
          <Link to="/providers" className={linkStyle("/providers")}>
            <FiTruck className="h-3.5 w-3.5" /> Providers
          </Link>
          <Link to="/cart" className={linkStyle("/cart")}>
            <FiShoppingCart className="h-3.5 w-3.5" /> Cart
            {cartCount > 0 && (
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                isActive("/cart") ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
              }`}>
                {cartCount}
              </span>
            )}
          </Link>
          {user && (
            <>
              <Link to="/orders" className={linkStyle("/orders")}>
                <FiClipboard className="h-3.5 w-3.5" /> My Orders
              </Link>
              <Link to="/profile" className={linkStyle("/profile")}>
                <FiUser className="h-3.5 w-3.5" /> Profile
              </Link>
            </>
          )}
          <Link to="/support" className={linkStyle("/support")}>
            <FiHelpCircle className="h-3.5 w-3.5" /> Support
          </Link>

          {isAdmin && (
            <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-3">
              <Link to="/admin" className={linkStyle("/admin")}>
                <FiGrid className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <Link to="/admin/products" className={linkStyle("/admin/products")}>
                <FiBox className="h-3.5 w-3.5" /> Inventory
              </Link>
              <Link to="/admin/providers" className={linkStyle("/admin/providers")}>
                <FiTruck className="h-3.5 w-3.5" /> Vendors
              </Link>
              <Link to="/admin/orders" className={linkStyle("/admin/orders")}>
                <FiClipboard className="h-3.5 w-3.5" /> Orders
              </Link>
              <Link to="/admin/maintenance" className={linkStyle("/admin/maintenance")}>
                <FiTool className="h-3.5 w-3.5" /> Tickets
              </Link>
              <Link to="/admin/users" className={linkStyle("/admin/users")}>
                <FiUsers className="h-3.5 w-3.5" /> Users
              </Link>
            </div>
          )}
        </div>

        {/* User Auth Info */}
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] uppercase font-bold">
                  {user.name?.[0] || "U"}
                </div>
                <span>{user.name}</span>
                {isAdmin && (
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-700">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

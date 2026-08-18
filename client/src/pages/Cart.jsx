import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useSelector } from "react-redux";

function Cart() {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user") || "null");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/cart/${user._id}`);
      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [user?._id]);

  async function removeItem(id) {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateQty(id, qty) {
    try {
      await api.put(`/cart/${id}`, { quantity: qty });
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  }

  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.monthlyRent || item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white px-8 py-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">
                Shopping Cart ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Review your selected rentals and proceed to checkout when ready.
              </p>
            </div>
            {cart.length > 0 && (
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                {cart.length} Unique {cart.length === 1 ? "Product" : "Products"} Added
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm">
              Your cart is empty.
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product?.imgURL || item.product?.image || "https://placehold.co/120x90"}
                          alt={item.product?.name || item.product?.productName}
                          className="h-28 w-28 rounded-3xl object-cover"
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{item.product?.name || item.product?.productName}</h2>
                          <p className="text-sm text-slate-500">{item.product?.category}</p>
                          <p className="mt-2 text-blue-600 font-semibold">₹{item.product?.monthlyRent || item.product?.price}/month</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                          <button
                            onClick={() => updateQty(item._id, Math.max(1, item.quantity - 1))}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                          Tenure: {item.tenure || 3} months
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold text-slate-900">{totalItemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Monthly Total</span>
                    <span className="font-semibold text-blue-600">₹{total}</span>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    Delivery and setup included for most cities.
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;

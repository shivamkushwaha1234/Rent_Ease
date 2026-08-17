import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useSelector } from "react-redux";

function Checkout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryArea, setDeliveryArea] = useState(user?.address?.split(",")[1]?.trim() || "All");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  useEffect(() => {
    if (!user?._id) return;
    fetchCart();
  }, [user?._id]);

  async function fetchCart() {
    try {
      const res = await api.get(`/cart/${user._id}`);
      setCart(res.data);
      const total = res.data.reduce(
        (sum, item) => sum + item.product.monthlyRent * item.quantity * (item.tenure || 3),
        0
      );
      const deposit = res.data.reduce(
        (sum, item) => sum + item.product.securityDeposit * item.quantity,
        0
      );
      setTotalAmount(total);
      setDepositAmount(deposit);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  async function placeRentalOrder(e) {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before placing an order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty. Add items before checkout.");
      navigate("/cart");
      return;
    }

    try {
      await api.post("/orders", {
        user: user._id,
        deliveryDate,
        deliveryAddress,
        deliveryArea,
        paymentMethod,
      });

      toast.success("Order placed successfully.");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-4xl bg-white p-10 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900 mb-4">Checkout</h1>
            <p className="text-sm text-slate-500 mb-8">
              Confirm your delivery details, schedule your pickup, and complete the order payment.
            </p>

            <form onSubmit={placeRentalOrder} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  rows="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Area</label>
                <input
                  type="text"
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  placeholder="City or service area"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                >
                  <option value="Cash">Cash on Delivery</option>
                  <option value="Card">Card (simulated)</option>
                </select>
              </div>

              <div className="rounded-3xl bg-slate-100 p-5 text-sm text-slate-700">
                <p className="font-semibold">Order Summary</p>
                <p className="mt-3">Estimated rental total: ₹{totalAmount}</p>
                <p>Estimated deposit total: ₹{depositAmount}</p>
                <p>Payment status: {paymentMethod === "Card" ? "Paid" : "Pending"}</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Place Rental Order
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Checkout;

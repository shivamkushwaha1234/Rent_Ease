import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useSelector } from "react-redux";

function Orders() {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;
      try {
        const res = await api.get(`/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrders();
  }, [user?._id]);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white px-8 py-8 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900">My Orders</h1>
            <p className="mt-2 text-sm text-slate-500">Track your current and past rental orders in one place.</p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm">
              No orders yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Order ID</p>
                      <p className="text-lg font-semibold text-slate-900">{order._id}</p>
                      <p className="mt-2 text-sm text-slate-500">Delivery Date: {order.deliveryDate}</p>
                      <p className="text-sm text-slate-500">Return Date: {order.returnDate || "TBD"}</p>
                      <p className="text-sm text-slate-500">Address: {order.deliveryAddress}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        {order.status}
                      </span>
                      {(order.status === "Delivered" || order.status === "Approved") ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <input
                            type="date"
                            value={order.pickupDate || ""}
                            onChange={async (e) => {
                              try {
                                const pickupDate = e.target.value;
                                await api.put(`/orders/user/return/${order._id}`, { pickupDate });
                                const res = await api.get(`/orders/user/${user._id}`);
                                setOrders(res.data);
                              } catch (error) {
                                console.error(error);
                                toast.error("Unable to schedule pickup.");
                              }
                            }}
                            className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                          />
                          <button
                            onClick={async () => {
                              try {
                                if (!order.pickupDate) {
                                  toast.error("Choose a pickup date first.");
                                  return;
                                }
                                await api.put(`/orders/user/return/${order._id}`, { pickupDate: order.pickupDate });
                                const res = await api.get(`/orders/user/${user._id}`);
                                setOrders(res.data);
                                toast.success("Return requested successfully.");
                              } catch (error) {
                                console.error(error);
                                toast.error("Unable to request return.");
                              }
                            }}
                            className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Request Return
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                    <p className="text-sm text-slate-500">Total: ₹{order.totalAmount}</p>
                    <p className="text-sm text-slate-500">Deposit: ₹{order.depositAmount}</p>
                    <p className="text-sm text-slate-500">Pickup Date: {order.pickupDate || "Not scheduled"}</p>

                    <h3 className="mt-6 text-sm font-semibold text-slate-900 mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{item.product?.name || item.product?.productName}</p>
                              <p className="text-sm text-slate-500">Tenure: {item.tenure} months</p>
                            </div>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Orders;

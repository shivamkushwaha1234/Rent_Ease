import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pickupDates, setPickupDates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
      const dates = res.data.reduce((map, order) => {
        if (order.pickupDate) map[order._id] = order.pickupDate;
        return map;
      }, {});
      setPickupDates(dates);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePickupDateChange(id, value) {
    setPickupDates((prev) => ({ ...prev, [id]: value }));
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/orders/admin/${id}`, {
        status,
        pickupDate: pickupDates[id] || undefined,
      });
      fetchOrders();
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
            <h1 className="text-4xl font-semibold text-slate-900">Admin Orders</h1>
            <p className="mt-2 text-sm text-slate-500">Manage order fulfillment and track customer requests.</p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm">
              No orders found.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{order.user?.name}</h2>
                      <p className="text-sm text-slate-500">{order.user?.email}</p>
                      <p className="mt-2 text-sm text-slate-500">Delivery Date: {order.deliveryDate}</p>
                      <p className="text-sm text-slate-500">Delivery Area: {order.deliveryArea || "All"}</p>
                      <p className="text-sm text-slate-500">Return Date: {order.returnDate || "Not set"}</p>
                      <p className="text-sm text-slate-500">Pickup Date: {order.pickupDate || "Not set"}</p>
                      <p className="text-sm text-slate-500">Address: {order.deliveryAddress}</p>
                      <p className="text-sm text-slate-500">Payment: {order.paymentMethod || "Cash"} ({order.paymentStatus || "Pending"})</p>
                      <p className="text-sm text-slate-500">Total: ₹{order.totalAmount || 0}</p>
                      <p className="text-sm text-slate-500">Deposit: ₹{order.depositAmount || 0}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <input
                        type="date"
                        value={pickupDates[order._id] || ""}
                        onChange={(e) => handlePickupDateChange(order._id, e.target.value)}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                      />
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </div>

                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Products</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-slate-900">{item.product?.name}</span>
                            <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
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

export default AdminOrders;

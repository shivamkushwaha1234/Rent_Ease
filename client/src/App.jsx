import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Providers from "./pages/Providers";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminProviders from "./pages/AdminProviders";
import AdminUsers from "./pages/AdminUsers";
import MaintenanceRequests from "./pages/MaintenanceRequests";
import Support from "./pages/Support";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Products */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Orders */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />

        {/* Service Providers */}
        <Route path="/providers" element={<Providers />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/providers" element={<AdminProviders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/maintenance" element={<MaintenanceRequests />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/support" element={<Support />} />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen text-3xl font-bold">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

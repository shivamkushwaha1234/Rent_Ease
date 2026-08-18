import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Furniture",
    description: "",
    image: "",
    monthlyRent: "",
    securityDeposit: "",
    tenureOptions: "3,6,12",
    quantity: 1,
    serviceArea: "All",
    available: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      monthlyRent: Number(form.monthlyRent),
      securityDeposit: Number(form.securityDeposit),
      tenureOptions: form.tenureOptions.split(",").map((item) => Number(item.trim())),
      quantity: Number(form.quantity),
      available: Boolean(form.available),
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/admin/products", payload);
      }
      setForm({
        name: "",
        category: "Furniture",
        description: "",
        image: "",
        monthlyRent: "",
        securityDeposit: "",
        tenureOptions: "3,6,12",
        quantity: 1,
        serviceArea: "All",
        available: true,
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Unable to save product.");
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      monthlyRent: product.monthlyRent,
      securityDeposit: product.securityDeposit,
      tenureOptions: product.tenureOptions.join(","),
      quantity: product.quantity,
      serviceArea: product.serviceArea || "All",
      available: product.available,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete product.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
            <h1 className="text-4xl font-semibold text-slate-900">Admin Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage inventory, pricing, and service areas for rentals.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Add / Edit Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" rows="4" required />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="monthlyRent" value={form.monthlyRent} onChange={handleChange} type="number" placeholder="Monthly Rent" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                  <input name="securityDeposit" value={form.securityDeposit} onChange={handleChange} type="number" placeholder="Security Deposit" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="tenureOptions" value={form.tenureOptions} onChange={handleChange} placeholder="Tenure Options (3,6,12)" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                  <input name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder="Quantity" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="serviceArea" value={form.serviceArea} onChange={handleChange} placeholder="Service Area" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900" />
                  <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900">
                    <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                    Available
                  </label>
                </div>
                <button type="submit" className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">{editingId ? "Update Product" : "Add Product"}</button>
              </form>
            </div>

            <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Product Inventory</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{product.name || product.productName}</p>
                        <p className="text-sm text-slate-500">{product.category} • {product.serviceArea}</p>
                        <p className="text-sm text-slate-500">Qty {product.quantity} • {product.available ? "In stock" : "Unavailable"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminProducts;

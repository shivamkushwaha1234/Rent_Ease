import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setTenure(res.data.tenureOptions?.[0] || 3);
      } catch (error) {
        console.error(error);
        toast.error("Product not found.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const [tenure, setTenure] = useState(3);

  async function addCart() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login first to add products to cart.");
      navigate("/login");
      return;
    }

    if (!product.available) {
      toast.error("This product is currently unavailable.");
      return;
    }

    try {
      await api.post("/cart", {
        user: user._id,
        product: product._id,
        quantity: 1,
        tenure,
      });

      toast.success("Product added to cart successfully.");
      navigate("/cart");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to add product to cart.");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <h2 className="text-2xl font-semibold text-slate-900">Loading...</h2>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <h2 className="text-2xl font-semibold text-red-600">Product not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-4xl overflow-hidden bg-white shadow-sm border border-slate-200">
              <img
                src={product.imgURL || product.image || "https://placehold.co/600x400"}
                alt={product.name || product.productName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
                <h1 className="text-4xl font-semibold text-slate-900">{product.name || product.productName}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">{product.category}</p>
                <p className="mt-6 text-slate-600 leading-7">{product.description}</p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Monthly Rent</p>
                    <p className="text-3xl font-semibold text-blue-600">₹{product.monthlyRent || product.price}/month</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Deposit ₹{product.securityDeposit ?? Math.round((product.price || product.monthlyRent || 0) * 0.2)}
                  </div>
                </div>
                <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <p>Service area: {product.serviceArea || "All Areas"}</p>
                  <p>{product.available ? "Available for rent" : "Currently unavailable"}</p>
                </div>
              </div>

              <div className="rounded-4xl bg-white p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Rental Plans</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tenure</label>
                    <select
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    >
                      {product.tenureOptions?.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan} Months
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-500">Selected tenure will determine your return schedule after delivery.</p>
                  </div>
                </div>

                <button
                  onClick={addCart}
                  className="mt-8 w-full rounded-3xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetails;

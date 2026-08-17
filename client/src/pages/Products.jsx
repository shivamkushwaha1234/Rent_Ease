import { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [serviceArea, setServiceArea] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const serviceAreas = [
    "All",
    ...Array.from(
      new Set(
        products
          .map((item) => item.serviceArea || "All")
          .filter((area) => area !== "All")
      )
    ),
  ];

  const filteredProducts = products.filter((item) => {
    const matchName = item.name
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : false;
    const matchCategory = category === "All" || item.category === category;
    const matchServiceArea = serviceArea === "All" || (item.serviceArea || "All") === serviceArea;
    return matchName && matchCategory && matchServiceArea;
  });

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 rounded-4xl bg-white px-8 py-8 shadow-sm border border-slate-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-slate-900">Rent Products</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Discover furniture and appliances with flexible monthly plans and fast delivery.
                </p>
              </div>

              <div className="grid gap-4 w-full md:w-auto md:grid-cols-3">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <FiFilter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div className="relative">
                  <FiFilter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                  >
                    {serviceAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm">
              No products found. Try changing your search or filters.
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Products;

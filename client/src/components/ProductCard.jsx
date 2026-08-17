import { Link } from "react-router-dom";
import { FiTag } from "react-icons/fi";

function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.image || "https://placehold.co/400x300"}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300";
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
          {product.description || "Comfortable rentals for every home and lifestyle."}
        </p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Monthly Rent</p>
              <p className="text-2xl font-semibold text-blue-600">₹{product.monthlyRent}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Deposit ₹{product.securityDeposit}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{product.serviceArea || "All Areas"}</span>
            <span>{product.available ? "Available" : "Unavailable"}</span>
          </div>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiTag className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;

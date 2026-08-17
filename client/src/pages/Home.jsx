import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiClock, FiLayers, FiUsers } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <section className="bg-slate-50 pb-24 pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="space-y-8">
              <p className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
                Smart rentals for modern living
              </p>

              <div className="space-y-4">
                <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                  Rent premium furniture and appliances with confidence.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Flexible monthly rentals for homes, students, and startups. Discover curated products, simple checkout, and trusted delivery across your city.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Browse Products
                  <FiArrowRight className="ml-3 h-5 w-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <FiUsers className="mr-3 h-5 w-5 text-blue-600" />
                  Create an Account
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white px-6 py-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <FiLayers className="h-5 w-5" />
                    <p className="text-sm font-semibold">Curated products</p>
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">1k+</p>
                </div>
                <div className="rounded-3xl bg-white px-6 py-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <FiClock className="h-5 w-5" />
                    <p className="text-sm font-semibold">Fast support</p>
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">24/7</p>
                </div>
                <div className="rounded-3xl bg-white px-6 py-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <FiCheckCircle className="h-5 w-5" />
                    <p className="text-sm font-semibold">Flexible plans</p>
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">Flexible</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-1 shadow-2xl shadow-slate-900/10">
              <div className="h-full rounded-[1.75rem] bg-white p-6 md:p-8">
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&auto=format&fit=crop"
                  alt="Modern furnished living room"
                  className="h-full w-full rounded-[1.5rem] object-cover shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;

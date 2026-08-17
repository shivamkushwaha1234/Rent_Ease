import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheckCircle, FiMapPin, FiMail, FiPackage, FiTool, FiBriefcase } from "react-icons/fi";

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("All");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/providers");
      setProviders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const serviceAreas = ["All", ...new Set(providers.map((p) => p.serviceArea).filter(Boolean))];

  const filteredProviders = selectedArea === "All"
    ? providers
    : providers.filter((p) => p.serviceArea === selectedArea || p.serviceArea === "All");

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Banner */}
          <div className="mb-10 rounded-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur border border-indigo-400/20">
                <FiBriefcase className="h-3.5 w-3.5" /> Verified Ecosystem Partners
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Service & Rental Providers
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Browse our certified vendor partners, logistics specialists, and maintenance providers who keep your rented furniture and appliances running smoothly.
              </p>
            </div>
          </div>

          {/* Area Filter */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <FiMapPin className="h-4 w-4 text-indigo-600" /> Filter by Service Area:
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    selectedArea === area
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-4 text-sm font-medium">Loading verified providers...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
              <p className="text-slate-500 text-lg">No service providers found for the selected area.</p>
            </div>
          ) : (
            /* Providers Grid */
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((provider) => (
                <div
                  key={provider._id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-7 shadow-sm border border-slate-200 transition hover:shadow-xl hover:-translate-y-1 duration-200"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {provider.skillType || "Service Vendor"}
                        </span>
                        <h2 className="mt-2 text-xl font-bold text-slate-900">{provider.name}</h2>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                        <FiCheckCircle className="h-3 w-3" /> Verified
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {provider.description || "Official logistics, maintenance & product vendor for RentEase items."}
                    </p>

                    {/* Meta info */}
                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-slate-400" />
                        <span>Coverage: <strong>{provider.serviceArea || "All Cities"}</strong></span>
                      </div>
                      {provider.contactEmail && (
                        <div className="flex items-center gap-2">
                          <FiMail className="h-4 w-4 text-slate-400" />
                          <span>{provider.contactEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* Services Offered */}
                    {provider.servicesOffered && provider.servicesOffered.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                          <FiTool className="h-3 w-3" /> Services Offered
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {provider.servicesOffered.map((svc, i) => (
                            <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 font-medium">
                              {svc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Packages / Pricing */}
                    {provider.packages && provider.packages.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                          <FiPackage className="h-3 w-3" /> Featured Bundles
                        </h3>
                        <div className="space-y-2">
                          {provider.packages.map((pkg, idx) => (
                            <div key={idx} className="rounded-2xl bg-slate-50 p-3 text-xs border border-slate-100">
                              <div className="flex justify-between font-semibold text-slate-800">
                                <span>{pkg.name}</span>
                                <span className="text-indigo-600">₹{pkg.monthlyRent}/mo</span>
                              </div>
                              <p className="mt-1 text-slate-500">Deposit: ₹{pkg.securityDeposit} | Tenure: {pkg.tenureOptions?.join(", ")} mo</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => alert(`Service Partner: ${provider.name}\nEmail: ${provider.contactEmail || "support@rentease.com"}\nService Area: ${provider.serviceArea}`)}
                      className="w-full rounded-2xl bg-slate-900 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-indigo-600"
                    >
                      Contact Service Partner
                    </button>
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

export default Providers;

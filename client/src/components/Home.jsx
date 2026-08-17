import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
return (
<> <Navbar />


  <section className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Rent Furniture & Appliances with Ease
        </h1>

        <p className="text-gray-600 mt-6 text-lg">
          Affordable monthly rentals for homes, students,
          professionals, and startups. No huge upfront cost.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Browse Products
          </Link>

          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div>
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&auto=format&fit=crop"
          alt="Modern furnished living room"
          className="rounded-2xl shadow-xl w-full"
        />
      </div>
    </div>
  </section>
</>


);
}

export default Home;

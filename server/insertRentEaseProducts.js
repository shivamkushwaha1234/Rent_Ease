import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI missing in .env");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to MongoDB for inserting RentEase furniture & appliances...");

const renteaseItems = [
  {
    name: "Wooden Bed",
    productName: "Wooden Bed",
    category: "Furniture",
    description: "Queen size solid wooden bed frame with ergonomic headboard and under-bed storage drawers.",
    monthlyRent: 1200,
    price: 1200,
    securityDeposit: 3000,
    tenureOptions: [3, 6, 12],
    quantity: 15,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Double Door Refrigerator",
    productName: "Double Door Refrigerator",
    category: "Appliances",
    description: "260L double door frost-free refrigerator with inverter compressor and multi-airflow cooling.",
    monthlyRent: 950,
    price: 950,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    quantity: 10,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Modern 3-Seater Sofa",
    productName: "Modern 3-Seater Sofa",
    category: "Furniture",
    description: "Plush fabric 3-seater living room sofa with deep seating cushions and stain-resistant fabric.",
    monthlyRent: 750,
    price: 750,
    securityDeposit: 2000,
    tenureOptions: [3, 6, 12],
    quantity: 12,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ergonomic Study Desk",
    productName: "Ergonomic Study Desk",
    category: "Furniture",
    description: "Minimalist desk with cable management port, built-in drawer, and sturdy steel legs.",
    monthlyRent: 450,
    price: 450,
    securityDeposit: 1200,
    tenureOptions: [3, 6, 12],
    quantity: 20,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "High-Back Mesh Chair",
    productName: "High-Back Mesh Chair",
    category: "Furniture",
    description: "Adjustable height office chair with lumbar support, 3D armrests, and breathable mesh back.",
    monthlyRent: 350,
    price: 350,
    securityDeposit: 1000,
    tenureOptions: [3, 6, 12],
    quantity: 18,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1505843490701-5be5d1bdfb35?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1505843490701-5be5d1bdfb35?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Front-Load Washing Machine",
    productName: "Front-Load Washing Machine",
    category: "Appliances",
    description: "7kg fully automatic front load washer with steam hygiene, 1200 RPM spin, and quick 15-min wash.",
    monthlyRent: 850,
    price: 850,
    securityDeposit: 2200,
    tenureOptions: [3, 6, 12],
    quantity: 8,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "50-Inch 4K Smart LED TV",
    productName: "50-Inch 4K Smart LED TV",
    category: "Electronics",
    description: "Ultra HD 4K Smart TV with Dolby Atmos sound, Netflix/Prime built-in, and voice search remote.",
    monthlyRent: 990,
    price: 990,
    securityDeposit: 2600,
    tenureOptions: [3, 6, 12],
    quantity: 10,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "4-Seater Dining Table",
    productName: "4-Seater Dining Table",
    category: "Furniture",
    description: "Compact dining set with solid wood table top and four cushioned ergonomic chairs.",
    monthlyRent: 850,
    price: 850,
    securityDeposit: 2300,
    tenureOptions: [3, 6, 12],
    quantity: 6,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "1.5 Ton Split AC",
    productName: "1.5 Ton Split AC",
    category: "Appliances",
    description: "5-star energy efficient inverter split air conditioner with copper condenser and dust filters.",
    monthlyRent: 1100,
    price: 1100,
    securityDeposit: 2800,
    tenureOptions: [3, 6, 12],
    quantity: 14,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Single Bed with Mattress",
    productName: "Single Bed with Mattress",
    category: "Furniture",
    description: "Comfortable single bed with orthopedic mattress suitable for students and professionals.",
    monthlyRent: 700,
    price: 700,
    securityDeposit: 1800,
    tenureOptions: [3, 6, 12],
    quantity: 18,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Wardrobe Cabinet",
    productName: "Wardrobe Cabinet",
    category: "Furniture",
    description: "Spacious 2-door wardrobe with shelves and hanging space.",
    monthlyRent: 500,
    price: 500,
    securityDeposit: 1400,
    tenureOptions: [3, 6, 12],
    quantity: 15,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bookshelf Rack",
    productName: "Bookshelf Rack",
    category: "Furniture",
    description: "5-tier wooden bookshelf ideal for books, decor, and storage.",
    monthlyRent: 250,
    price: 250,
    securityDeposit: 700,
    tenureOptions: [3, 6, 12],
    quantity: 22,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Coffee Table",
    productName: "Coffee Table",
    category: "Furniture",
    description: "Modern center table with tempered glass top and storage shelf.",
    monthlyRent: 220,
    price: 220,
    securityDeposit: 600,
    tenureOptions: [3, 6, 12],
    quantity: 20,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "TV Entertainment Unit",
    productName: "TV Entertainment Unit",
    category: "Furniture",
    description: "Stylish TV unit with cabinets and cable management.",
    monthlyRent: 450,
    price: 450,
    securityDeposit: 1200,
    tenureOptions: [3, 6, 12],
    quantity: 10,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gaming Chair",
    productName: "Gaming Chair",
    category: "Furniture",
    description: "Reclining gaming chair with lumbar and neck support.",
    monthlyRent: 480,
    price: 480,
    securityDeposit: 1300,
    tenureOptions: [3, 6, 12],
    quantity: 12,
    serviceArea: "All",
    available: true,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80",
    imgURL: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80",
  }
];

let added = 0;
for (const item of renteaseItems) {
  const exists = await Product.findOne({
    $or: [{ name: item.name }, { productName: item.productName }]
  });

  if (!exists) {
    await Product.create(item);
    added++;
  }
}

console.log(`Successfully added ${added} Furniture & Appliance products into MongoDB Atlas database!`);
process.exit(0);

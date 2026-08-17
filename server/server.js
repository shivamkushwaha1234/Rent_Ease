import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/payment", paymentRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
}

app.get("/", (req, res) => {
    res.json({
        message: "RentEase API Running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
);
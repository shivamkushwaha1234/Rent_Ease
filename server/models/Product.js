import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    tenureOptions: {
      type: [Number],
      default: [3, 6, 12],
    },

    quantity: {
      type: Number,
      default: 1,
    },

    serviceArea: {
      type: String,
      default: "All",
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model("Product", productSchema);
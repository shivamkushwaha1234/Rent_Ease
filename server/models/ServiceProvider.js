import mongoose from "mongoose";

const servicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  description: String,
});

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    skillType: {
      type: String,
      default: "Rental & Logistics Provider",
    },
    servicesOffered: {
      type: [String],
      default: ["Express Delivery", "Free Maintenance", "Professional Setup"],
    },
    description: {
      type: String,
    },
    serviceArea: {
      type: String,
      default: "All Cities",
    },
    packages: {
      type: [servicePackageSchema],
      default: [],
    },
    contactEmail: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ServiceProvider", serviceProviderSchema);

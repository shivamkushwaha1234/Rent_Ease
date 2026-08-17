import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},


items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    tenure: {
      type: Number,
      default: 3,
    },
  },
],

deliveryDate: {
  type: String,
  required: true,
},

deliveryArea: {
  type: String,
},

returnDate: {
  type: String,
},

pickupDate: {
  type: String,
},

deliveryAddress: {
  type: String,
  required: true,
},

paymentMethod: {
  type: String,
  enum: ["Card", "Cash"],
  default: "Cash",
},

paymentStatus: {
  type: String,
  enum: ["Paid", "Pending"],
  default: "Pending",
},

totalAmount: {
  type: Number,
  default: 0,
},

depositAmount: {
  type: Number,
  default: 0,
},

status: {
  type: String,
  enum: ["Pending", "Approved", "Delivered", "Return Requested", "Returned", "Damage Reported", "Dispute Reported"],
  default: "Pending",
},


},
{
timestamps: true,
}
);

export default mongoose.model("Order", orderSchema);

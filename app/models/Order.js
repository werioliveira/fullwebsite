import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      maxlength: 60,
    },
    products: {
      type: Array,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "not paid",
    },
    order_id_paypal: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

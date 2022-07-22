import mongoose from "mongoose";

const { Schema } = mongoose;

const orderDetails = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  order: { type: mongoose.Types.ObjectId, ref: "Order" },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  isDelete: { type: Boolean, default: false },
  deleteAt: { type: Date, default: Date.now() },
});

export const OrderDetails = mongoose.model("OrderDetails", orderDetails);

import mongoose from "mongoose";

const { Schema } = mongoose;

const product = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  manufacture: {
    type: mongoose.Types.ObjectId,
    ref: "Manufacture",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceSale: {
    type: Number,
    required: false,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
    required: false,
  },
  isDelete: {
    type: Boolean,
    default: false, // existing product
  },
  timeCreate: {
    type: Date,
    default: Date.now(),
  },
  timeUpdate: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
  updateBy: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Product = mongoose.model("Product", product);

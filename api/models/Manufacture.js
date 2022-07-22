import mongoose from "mongoose";

const { Schema } = mongoose;

const manufacture = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  image: { type: String },
  description: { type: String, required: false },
  status: { type: mongoose.Types.ObjectId, ref: "StatusManufacture" },
  createBy: { type: mongoose.Types.ObjectId, ref: "User" },
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
  updateBy: { type: mongoose.Types.ObjectId, ref: "User" },
  isDelete: { type: Boolean, default: false },
  deleteAt: { type: Date, default: Date.now() },
});
export const Manufacture = mongoose.model("Manufacture", manufacture);

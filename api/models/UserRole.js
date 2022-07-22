import mongoose from "mongoose";

const { Schema } = mongoose;

const userRole = new Schema({
  name: { type: String, required: true, default: "MEMBER", unique: true },
  description: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isDelete: { type: Boolean, default: false },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
});

export const Role = mongoose.model("Role", userRole);

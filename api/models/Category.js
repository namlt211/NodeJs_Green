import mongoose from "mongoose";

const { Schema } = mongoose;

const category = new Schema({
  name: {
    type: String,
    required: true,
  },
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  updateAt: {
    type: Date,
    default: Date.now(),
    isDelete: { type: Boolean, default: false },
  },
  deleteAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Category = mongoose.model("Category", category);

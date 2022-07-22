import mongoose from "mongoose";

const { Schema } = mongoose;

const status = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

export const StatusManufacture = mongoose.model("StatusManufacture", status);

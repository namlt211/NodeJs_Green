import mongoose from "mongoose";

const { Schema } = mongoose;

const orders = new Schema({
  status: {
    type: String,
    isIn: [
      "PENDING",
      "CONFIRM",
      "DELIVERY",
      "DELIVERED",
      "COMPLETED",
      "CANCELLED",
    ],
    defaultTo: "PENDING",
  },
  note: {
    type: String,
    required: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  isDelete: {
    type: Boolean,
    default: false, // existing order
  },
  timeCreated: {
    type: Date,
    default: Date.now(),
  },
  timeUpdate: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
});

export const Orders = mongoose.model("Orders", orders);

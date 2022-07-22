import mongoose from "mongoose";

const { Schema } = mongoose;

const menu = new Schema({
  parent: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  isDelete: { type: Boolean, default: false },
});

export const Menu = mongoose.model("Menu", menu);

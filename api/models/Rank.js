import mongoose from "mongoose";

const { Schema } = mongoose;

const rank = new Schema({
  name: { type: String, required: true, default: "NEWBIE" },
  description: { type: String, required: false },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
  isDelete: { type: Boolean, default: false },
});

export const Rank = mongoose.model("Rank", rank);

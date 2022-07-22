import mongoose from "mongoose";
const { Schema } = mongoose;

const users = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  locked: {
    type: Boolean,
    default: false, //
  },
  isDelete: {
    type: Boolean,
    default: false, // existing user
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  deleteAt: { type: Date, default: Date.now() },
});

export const User = mongoose.model("User", users);

import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartItem = new Schema({
    product: {type: mongoose.Types.ObjectId, ref: "Product"},
    cart: {type: mongoose.Types.ObjectId, ref: "Cart"},
    quantity: {type: Number, required: true},
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
})

export const CartItem = mongoose.model("CartItem", cartItem)
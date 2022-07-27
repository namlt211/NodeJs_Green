import mongoose from "mongoose";
const { Schema  } = mongoose;

const cart = new Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    delivery: {type: Date},
    total: {type: Number},
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

export const Cart = mongoose.model('Cart', cart);
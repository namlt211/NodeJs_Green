import { CartItem } from "../models/CartItem";


export const createCartItem = async (req, res) => {
    const cart = {
        product: req.body.productId,
        cart: req.body.cartId,
        quantity: 0,
    }
    const  data = CartItem(cart);
    await data.save();
    res.status(200).json({success: true, message: 'Cart added successfully', data:  data});
    try{

    }catch(err){res.status(500).json({success: false, message: "create cart item failed", message: err.message});}
}

export const getAllItemsByCartId = async (req, res) => {
    const cartId = req.params.id;
    try { 
        const data = await CartItem.find({$and: [{cart: cartId}, {isDelete: false}]});
        res.status(200).json({success: true, message: 'All items retrieved successfully', data: data});
      }catch(err){res.status(500).json({success: false, message: "get all items failed", message: err.message});}
}
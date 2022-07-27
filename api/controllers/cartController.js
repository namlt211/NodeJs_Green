import { Cart } from "../models/Cart";

export const createCartByUser = async(req, res) =>{
    try{
        const cart = {
            userId: req.param.user,
            delivery: "PENDING",
        }
        const result = Cart(cart);
        await result.save();
        res.status(200).json({success: true, message: "Create cart successfully !", data: result});
    }catch(err){
        res.status(500).json({success: false, message: "Error creating cart", data: err.message});
    }    
}

export const getCartByUserId = async(req, res) => {
    try{
        const result = await Cart.findById(req.params.userId);
        res.status(200).json({success: true, message: "Success", data: result});
    }catch(err){ res.status(500).json({success: false, message: "Error getting Cart", data: err.message}); }
}
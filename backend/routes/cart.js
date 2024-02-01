import express from "express"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Cart } from "../models/cart.js";
import { User } from "../models/user.js";
export const cartRouter = express.Router()

const ObjectId = mongoose.Types.ObjectId;
const isAuthenticated = async (req, res, next) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).send("Unauthorized: No token found");
      }
  
      const decoded = jwt.decode(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).send("Unauthorized: Invalid token");
      }
  
      const userId = decoded.userId;
      req.user = await User.findById(userId);
  
      if (!req.user) {
        return res.status(401).send("Unauthorized: User not found");
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };

 cartRouter.post('/add-to-cart', isAuthenticated, async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
  // const updatedID =  new ObjectId(productId)

    try {
      const existingCartItem = await Cart.findOne({ userId, productId });
  
      if (existingCartItem) {
        // If the item is already in the cart, update the quantity
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
      } else {
        // If the item is not in the cart, create a new cart item
        await Cart.create({ userId, productId, quantity });
      }
  
      res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  cartRouter.get('/get-cart', isAuthenticated, async (req, res) => {
    const userId = req.user._id;
  
    try {
      const userCart = await Cart.find({ userId })
      res.status(200).json({ cart: userCart });
    } catch (error) {
      console.error('Error getting user cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  cartRouter.delete('/remove-from-cart/:cartItemId', isAuthenticated, async (req, res) => {
        const cartItemId = req.params.cartItemId
    
    try {
        await Cart.findByIdAndDelete(cartItemId)
    //   await Cart.findByIdAndRemove();
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
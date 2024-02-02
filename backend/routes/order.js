// import {isAdmin} from "./productroute.js"
import express from "express";
import { User } from "../models/user.js";
import { Products, productSchema } from "../models/product.js";
import jwt from "jsonwebtoken";
import { Orders } from "../models/order.js";
import { Cart } from "../models/cart.js";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config({path:'backend/config/config.env'})
const stripe  = new Stripe(process.env.STRIPE_KEY)
export const isAuthenticated = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.header('auth-token');
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
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    
    if (!token) {
      return res.status(401).send("Unauthorized: No token found");
    }
    
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).send("Unauthorized: Invalid token");
    }
    
    const userId = decoded.userId;
    req.user = await User.findById(userId);
    
    if (!req.user || req.user.role !== "admin") {
      return res
      .status(403)
      .send("Forbidden: Only admins can perform this action");
    }
    
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const orderRouter = express.Router();

orderRouter.post("/place-order", isAuthenticated, async (req, res) => {
  let totalPrice = 0;
  try {
    const { shippingInfo, products } = req.body;

     

    for (const product of products) {
      // used for of loop to iterate over the products object usme jo value hai
      const productId = await product.product; //product first wala har value hai us object ki next wala uske andar jo porduct likha hai
      console.log(productId);

      const singleProduct = await Products.findById(productId);
// console.log(req.user._id)
      const productPrice = product.quantity * singleProduct.price;
      totalPrice += productPrice;
      const c = await Cart.findOneAndDelete({productId:productId,userId:req.user._id})
      console.log(c)
    }

    const lineItems = products.map((product)=>({
      price_data:{
        currency:'inr',
        product_data:{
          name:product.product
        },unit_amount:Math.round(totalPrice*100),
      },quantity:product.quantity 
    }))
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:lineItems,
      mode:'payment',success_url:"https://dash-deals.onrender.com/success",
      cancel_url:"https://dash-deals.onrender.com/cancel"
    })
      
    const order = await Orders.create({
      shippingInfo,
      products,
      user: req.user._id,
      totalPrice,
    });

    
    res.status(201).json({ order ,id:session.id });
  
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Sever Error");
  }
});

orderRouter.get("/getorder/:id", isAuthenticated, async (req, res) => {
  const orderId = req.params.id;
  try {
    if (!orderId) {
      return res.send("Order not exists");
    }
    const order = await Orders.findById(orderId);
    res.status(200).json({ order });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});
orderRouter.get("/me", isAuthenticated, async (req, res) => {
  const token = req.header('auth-token')
  try {
    if (!token) {
      return res.send("token not found");
    }
    const decodedToken = jwt.verify(token, 'DHRUV'); // Replace 'your-secret-key' with your actual secret key

    const userId = decodedToken.userId;
    console.log(userId);

    console.log(userId);
    const order = await Orders.find({ user: userId });

    res.json({ order });
  } catch (error) {
    res.status(500).send("Internal Server error");
  }
});
orderRouter.get("/getallorders", isAdmin, async (req, res) => {
  const orders = await Orders.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

orderRouter.put("/update/:id", isAdmin, async (req, res, next) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.status === "Delivered") {
      return next(new ErrorHander("You have already delivered this order", 400));
    }

    console.log(req.body.status, order.status);

    if (order.status === "Pending") {
      if (req.body.status === "Processing") {
        // Perform any necessary actions for transitioning from Pending to Processing
        order.status = req.body.status;
      } else {
        return res.status(400).json({ error: "Invalid status transition" });
      }
    } else if (order.status === "Processing") {
      if (req.body.status === "Shipped") {
        // Perform any necessary actions for transitioning from Processing to Shipped
        order.products.forEach(async (p) => {
          await updateStock(p.product, p.quantity);
        });
        order.status = req.body.status;
      } else {
        return res.status(400).json({ error: "Invalid status transition" });
      }
    } else if (order.status === "Shipped") {
      if (req.body.status === "Delivered") {
        // Perform any necessary actions for transitioning from Shipped to Delivered
        order.status = req.body.status;
        order.deliveredAt = Date.now();
      } else {
        return res.status(400).json({ error: "Invalid status transition" });
      }
    } else {
      return res.status(400).json({ error: "Invalid status transition" });
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});


async function updateStock(id, quantity) {
  const product = await Products.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}
orderRouter.delete('/delete/:id',isAdmin,async(req,res)=>{
  const order = await Orders.findById(req.params.id);
    if(!order){
    return  res.status(404).send("Order not found")
    }

    else{
      await order.deleteOne()
      res.status(200).send("Deleted successfully")
    }

})
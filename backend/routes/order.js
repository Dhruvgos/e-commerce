// import {isAdmin} from "./productroute.js"
import express from "express";
import { User } from "../models/user.js";
import { Products, productSchema } from "../models/product.js";
import jwt from "jsonwebtoken";
import { Orders } from "../models/order.js";
export const isAuthenticated = async (req, res, next) => {
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
const isAdmin = async (req, res, next) => {
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

      const productPrice = product.quantity * singleProduct.price;
      totalPrice += productPrice;
    }
    const order = await Orders.create({
      shippingInfo,
      products,
      user: req.user._id,
      totalPrice,
    });
    res.status(201).json({ order });
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
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.send("token not found");
    }
    const userId = jwt.decode(token);

    console.log(userId);
    const order = await Orders.find({ user: userId.userId });

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

orderRouter.put("/update/:id",isAdmin, async (req, res) => {
  const order = await Orders.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.status === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped" && order.status!="Shipped") {
    order.products.forEach(async (p) => {
      await updateStock(p.product, p.quantity);
    });
  }
  else{
    return res.send("Already shipped")
  }
  order.status = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
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
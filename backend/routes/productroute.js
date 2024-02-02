import express from "express";
import { getAllproducts } from "../controller/productController.js";
import { User } from "../models/user.js";
import { Products, productSchema } from "../models/product.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { isAuthenticated } from "./order.js";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const productrouter = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
export const isAdmin = async (req, res, next) => {
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

productrouter.post("/add",  upload.array('images'),isAdmin,async (req, res) => {
  const { name, description, price, category, stock,images } = req.body;

  try {
    // const uploadedImages = [];

    // for (const file of req.files) {
    //   const result = await cloudinary.uploader.upload(file.buffer); // Upload image to Cloudinary
    //   uploadedImages.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    //   });
    // }

    const product = await Products.create({
      name,
      description,
      price,
      category,
      stock,
      user: req.user._id,
      images, // Save Cloudinary URLs in MongoDB
    });

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

productrouter.delete("/:product_id/delete", isAdmin, async (req, res) => {
  try {
    const productid = req.params.product_id;

    const product = await Products.findById(productid);
    if (product.user.toString() !== req.user._id.toString()) {
      return res.send("Other admin cannot delete the product");
    }
    await Products.deleteOne({ _id: productid });
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

productrouter.get("/getall", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page, adjust as needed

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Products.find({});

    if (products.length > 0) {
      return res.status(200).json({ products });
    } else {
      return res.send("No products found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
productrouter.get("/getadminproducts", isAdmin, async (req, res) => {
  // console.log(req.user._id)
  const userId = req.user._id;
  const product = await Products.find({ user: userId });

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
productrouter.get("/get/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  try {
    const product = await Products.findById(product_id);
    if (!product) {
      return res.send("Product not found");
    }
    res.json({ product });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

productrouter.put("/:productId/update", isAdmin, async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // console.log(req.body)
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    // console.log(product.name)
    await product.save();
    // console.log(product.name)

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

productrouter.put("/create-review/:id", isAuthenticated, async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Products.findById(req.params.id);
  if (!product) {
    return res.send("product not found");
  }
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (existingReview) {
    return res
      .status(400)
      .send("You have already submitted a review for this product");
  }

  product.reviews.push({
    user: req.user._id,
    rating,
    comment,
    name: req.user.name,
  });
  product.numOfReviews += 1;

  const totalRating = product.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  product.rating = totalRating / product.numOfReviews;

  await product.save();
  res.status(200).json({ product });
});
productrouter.get("/productreview/:id", async (req, res) => {
  const product = await Products.findById(req.params.id);
  if (!product) {
    return res.status(404).send("product not found");
  }
  const productReview = product.reviews;

  res.status(200).json({ productReview });
});

productrouter.delete(
  "/productreview/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const userId = req.user._id;

      // Use filter to exclude the review of the current user
      const updatedReviews = product.reviews.filter(
        (p) => p.user.toString() !== userId.toString()
      );

      // Check if reviews have been updated before making the update
      if (updatedReviews.length === product.reviews.length) {
        return res.send("Other users cannot delete reviews");
      }

      const noofrev = product.numOfReviews - 1;
      await Products.findByIdAndUpdate(productId, {
        reviews: updatedReviews,
        numOfReviews: noofrev,
      });

      res
        .status(200)
        .json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

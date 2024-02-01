import express from "express";
import { productrouter } from "./routes/productroute.js";
import multer from "multer";
import { userRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { orderRouter } from "./routes/order.js";
import cors from 'cors';
import { cartRouter } from "./routes/cart.js";
import {v2 as cloudinary} from 'cloudinary';

export const app = express();
// console.log(process.env.CLOUD_NAME)

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use('/api/v1/products', productrouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

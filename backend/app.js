import express from "express";
import { productrouter } from "./routes/productroute.js";
import { userRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { orderRouter } from "./routes/order.js";
export const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/products',productrouter)

app.use('/api/v1/users',userRouter);
app.use('/api/v1/orders',orderRouter);



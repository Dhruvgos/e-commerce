import dotenv from "dotenv";
import { app } from "./app.js";
import { connectdb } from "./config/database.js";
dotenv.config({path:'backend/config/config.env'})

connectdb();
app.listen(process.env.PORT,()=>{
    console.log(`server running at port ${process.env.PORT}`)
})
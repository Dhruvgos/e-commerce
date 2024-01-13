import mongoose from "mongoose";


export const connectdb = ()=>mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("database connected")
})
import mongoose from "mongoose";

export const connectdb = () => mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

import express from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { isAuthenticated } from "./order.js";
import { isAdmin } from "./productroute.js";
export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // Create a new user
    const newUser = await User.create({ name, email, password, role });

    // Generate a JWT
    const token = jwt.sign({ userId: newUser._id }, "DHRUV", {
      expiresIn: "1h",
    });

    // Set the token in a cookie (you might want to store it securely on the client side)
    res.cookie("token", token, { httpOnly: true, sameSite: 'Lax', secure: false });



    // Send the user and token information in the response
    res.json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user) {
      return res.status(401).send("User with this email could not be found");
    }

    const isPassword = await bcrypt.compare(password,user.password) 

    if (isPassword) {
      // Generate a JWT
      const token = jwt.sign({ userId: user._id }, "DHRUV", {
        expiresIn: "1h",
      });

      // Set the token in a cookie (httpOnly for security)
      res.cookie("token", token, { httpOnly: true, sameSite: 'None', secure: true });



      // Return user information and token in the response
      res.json({ user, token });
    } else {
      return res.status(401).send("Incorrect password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
userRouter.get('/logout', async (req, res) => {
    const token = req.cookies.token; 
    
    if (!token) {
        return res.status(401).send("No token found"); // Handle the case where no token is present
    }
    
    // Clear the token cookie by setting an empty string and an expiry date in the past
    res.cookie("token", "", { expires: new Date(0) });
    
    res.status(200).send("Logout successful");
});
userRouter.post('/me',isAuthenticated,async(req,res)=>{
    
    try {
        const token = req.cookies.token; 
        
        if (!token) {
            return res.status(401).send("No user"); // Handle the case where no token is present
        }
    
        const user = jwt.decode(token);
        const id = user.userId;
        const currentUser = await User.findById(id);
        res.json(currentUser)
        
    } catch (error) {
        console.log(error)
        res.send("Internal server error")
    }

})
userRouter.get('/getsingleuser/:id',isAdmin,async (req,res)=>{
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
})
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

console.log("Mongo URI exists:", !!process.env.MONGODB_URI);

// Middleware
app.use(
  cors({
    origin: [
      "https://nexflix-frontend-production.up.railway.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Secret key
app.set("secretKey", process.env.SECRET_KEY);


// MongoDB Connection (Vercel compatible)

let cachedConnection = null;

const connectToDatabase = async () => {

  if (cachedConnection) {
    return cachedConnection;
  }

  try {

    cachedConnection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("✅ Connected to MongoDB successfully");

    return cachedConnection;

  } catch (error) {

    console.log(
      "❌ MongoDB Connection Error:",
      error.message
    );

    throw error;

  }

};


// Connect database before every request

app.use(async (req, res, next) => {

  try {

    await connectToDatabase();

    next();

  } catch(error){

    res.status(500).json({
      message:"Database connection failed",
      error:error.message
    });

  }

});


// Routes

const Routes = require("./Api/Routes/Routes");

app.use("/user", Routes);


// Test route

app.get("/", (req, res)=>{

  res.send("Welcome to NETFLIX Backend API");

});


// Local server

if(process.env.NODE_ENV !== "production"){

  const PORT = process.env.PORT || 5000;


  app.listen(PORT, ()=>{

    console.log(
      `🚀 Server running on port ${PORT}`
    );

  });

}


// Vercel export

module.exports = app;
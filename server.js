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

// Check environment variable
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


// MongoDB Connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("✅ Connected to MongoDB successfully");

  } catch (error) {

    console.log(
      "❌ MongoDB Connection Error:",
      error.message
    );

  }
};


// Routes
const Routes = require("./Api/Routes/Routes");

app.use("/user", Routes);


// Test route
app.get("/", async (req, res) => {

  await connectToDatabase();

  res.send("Welcome to NETFLIX Backend API");

});


// Connect database for every request on Vercel
app.use(async (req, res, next) => {

  await connectToDatabase();

  next();

});

// Local server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
    });
}


// Vercel export
module.exports = app;
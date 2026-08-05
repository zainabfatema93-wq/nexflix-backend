const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Secret Key
app.set("secretKey", process.env.SECRET_KEY);

// Routes
const Routes = require("./Api/Routes/Routes");

app.use("/user", Routes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to NETFLIX Backend API");
});

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
   await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
});
      console.log("✅ Connected to MongoDB successfully");
    }
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
  }
};

connectToDatabase();

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Required for Vercel
module.exports = app;
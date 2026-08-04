const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(bodyParser.json()); // Parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Secret key (if needed for JWT or other auth)
app.set("secretKey", "i m zainab fatima and i m learning node js with express and mongo db 12234567890");
const Routes = require("./Api/Routes/Routes");

app.use("/user", Routes);

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to NETFLIX");
});



async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase');
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed connecting to MongoDB:", error);
  }
}
connectToDatabase();


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`🚀 Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed connecting to MongoDB:", error);
  }
}

connectToDatabase();




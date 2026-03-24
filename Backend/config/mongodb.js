import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Try connecting
    await mongoose.connect(process.env.MONGO_URI);

    // ✅ If success
    console.log("✅ MongoDB connected successfully!");
    console.log("📌 Connected to:", process.env.MONGO_URI);
  } catch (error) {
    // ❌ If error
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.log(`MongoDB connection error: ${err.message}`);
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

export default connectDb;

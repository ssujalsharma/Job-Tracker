const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * Handles both local MongoDB and MongoDB Atlas connection strings.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(
      `[Tip]: Make sure MongoDB is running locally, or add your MongoDB Atlas URI to backend/.env: MONGODB_URI=mongodb+srv://...`
    );
    // Note: In development we do not force process.exit(1) so the Express server
    // can still serve API health checks and display clear status to the developer.
  }
};

module.exports = connectDB;

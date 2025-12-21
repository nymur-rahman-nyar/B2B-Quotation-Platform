// backend/configs/db.js
import mongoose from "mongoose";

/**
 * Connect to MongoDB using the given URL.
 * @param {string} dbUrl - Your MongoDB connection string.
 * @returns {Promise<mongoose.Connection>}
 */
export default function connectDB(dbUrl) {
  return mongoose.connect(dbUrl);
}

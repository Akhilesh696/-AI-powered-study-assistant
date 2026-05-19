// Vercel Serverless Function entry point.
// This file wraps the existing Express app so Vercel can run it as a serverless function.
// All /api/* routes are handled here.

require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../server/server');

// Cache the mongoose connection across warm serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set. Please add it in your Vercel project settings.');
  }

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log('MongoDB connected (serverless)');
}

// Vercel expects a default export of the request handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  // Import routes
require('dotenv').config()
const app = express();

// Middleware to handle cross-origin requests

app.use(cors());
app.use(bodyParser.json());  // To parse JSON requests

// MongoDB connection
const mongodbURL = process.env.REACT_APP_MONGO_URL
if (!mongodbURL) {
    console.error("❌ MongoDB URL is missing. Check your .env file.");
    process.exit(1);  // Stop the server if the MongoDB URL is not set
}
console.log("MongoDB URL:", mongodbURL);
mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});

// API Routes
app.use('/api', authRoutes);  // Mount auth routes at /api

// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});

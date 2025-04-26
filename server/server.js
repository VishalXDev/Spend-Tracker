const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Importing the DB connection function

dotenv.config();

const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connecting to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');
    
    // Start the server after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

// Start the server
startServer();

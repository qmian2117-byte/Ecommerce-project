const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./router/user');
const productRouter = require('./router/product');
const dbconnect = require('./config/dbconnection');

dotenv.config();
const app = express();

// Connect to MongoDB
dbconnect();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data
app.use("/uploads", express.static("uploads")); // serve uploaded images

// Routes
app.use('/users', userRouter);
app.use('/products', productRouter); // products route

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

// Loads environment variables from the .env file into process.env
require('dotenv').config(); 

// Connect to database
mongoose.connect(process.env.MONGODB_URL,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(() => console.log('Failed to connect to MongoDB!'));

// Enable all CORS requests
app.use(cors());

// Parsing incoming requests with JSON payloads by using the express embedded functions
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
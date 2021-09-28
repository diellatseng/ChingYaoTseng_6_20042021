const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

//Connect to database
mongoose.connect('${{mongodb}}',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(() => console.log('Failed to connect to MongoDB!'));

// CORS (Cross-origin resource shring) settings
app.use(cors());

// To parse the incoming requests with JSON payloads
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
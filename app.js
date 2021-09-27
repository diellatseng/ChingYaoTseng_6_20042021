const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

//Connect to database
mongoose.connect('mongodb+srv://admin:iH1Tee2EOj75f2yG@cluster0.zcrlr.mongodb.net/piiquante?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(() => console.log('Failed to connect to MongoDB!'));

// CORS (Cross-origin resource shring) settings
app.use(cors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    methods: 'GET, POST, PUT, DELETE'
}))

// To parse the incoming requests with JSON payloads
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));



module.exports = app;
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema ({
    "email": {
        type: String, 
        required: [true, 'Required'], 
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Invalid']
    },
    "password": {
        type: String, 
        required: true, 
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
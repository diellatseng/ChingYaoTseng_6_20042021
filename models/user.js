const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema ({
    "email": {
        type: String, 
        required: [true, 'email is required'], 
        unique: [true, 'email has already been registered'],
        match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, 'invalid. For example: name@domain.com']
    },
    "password": {
        type: String, 
        required: [true, 'password is required'], 
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
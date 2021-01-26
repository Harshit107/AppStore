const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    website: {
        type: String,
        max: 10
    },
    email: {
        type: String,
        required: true,
        min: 5
    },
    password: {
        type: String,
        required: true,
        max: 1000,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Client', userSchema);

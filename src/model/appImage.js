const mongoose = require('mongoose');
require('dotenv').config();

const appImageSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
      required: true  
    },
    appBaseId: {
      type: mongoose.Schema.Types.ObjectId,
        required: true,
      unique : true
    },
    backgroundImage: [{
        image: {
            type: String,
            required : true
        },
        location: {
            type : String,
        }
    }],
    icon: {
        type: String,
    },
    screenshot : [{
        image: {
            type: String,
            required : true
        },
        location: {
            type : String,
        }
    }],
}, {
    timestamps : true
})

const appImage = mongoose.model('AppImage', appImageSchema);
module.exports = appImage
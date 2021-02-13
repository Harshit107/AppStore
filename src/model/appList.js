const mongoose = require('mongoose');
require('dotenv').config();

const appListSchema = new mongoose.Schema({
    appName: {
        type: 'String',
        required: true,
    },
    companyName: {
        type: 'String',
        required: true,  
    },
    appSize: {
        type: 'String',
        required: true, 
    },
    appDownload: {
        type: Number,
        default: 5,
    },
    appRating: {
        rating: {
            type: Number,
            default: 0,
            required: false,
        },
        users: [{
            IMEI: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: false
            }

        }]
    },
    appIcon: {
        type: 'String',
        required: true,  
    },
    appUrl: {
        type: 'String',
        required: true,
    },
    appVersion: {
        type: 'String',
        required: true,
    },
    appId: {
        type: 'String',
        required: true,
        unique: true,
    },
    appPackage: {
        type: 'String',
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, {
    timestamps : true
}) 


const AppList = mongoose.model('AppList', appListSchema)
module.exports = AppList;
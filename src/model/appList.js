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
        type: 'String',
        default: '6',
    },
    appRating: {
        type: 'String',
        default: 'N/A',
        required: false,
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
    },
    appPackage: {
        type: 'String',
        required: true,
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
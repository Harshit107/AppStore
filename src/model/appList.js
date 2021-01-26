const mongoose = require('mongoose');
require('dotenv').config();

const appListSchema = new mongoose.Schema({
    appName: {
        type: 'String',
        require: true,
    },
    companyName: {
        type: 'String',
        require: true,  
    },
    appSize: {
        type: 'String',
        require: true, 
    },
    appDownload: {
        type: 'String',
        require: true,
    },
    appRating: {
        type: 'String',
        require: true,
    },
    appIcon: {
        type: 'String',
        require: true,  
    },
    appUrl: {
        type: 'String',
        require: true,
    },
    appVersion: {
        type: 'String',
        require: true,
    }

}, {
    timestamps : true
}) 


const AppList = mongoose.model('AppList', appListSchema)
module.exports = AppList;
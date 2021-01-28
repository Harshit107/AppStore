const mongoose = require('mongoose');
require('dotenv').config();

const appListSchema = new mongoose.Schema({
    appId: {
        type: 'String',
        require: true,
    },
    appPackageName: {
        type: String,
        required : true
    },    //
    appAbout : {
        type: String,
        required : true, //
    },
    appBackgroundImage: {
        type: String,
        required : true, //        
    },
    appDescription: {
        type: String,
        required : true
    },
    appFeature: {
        type: String,
        required : true
    },
    appType: {
        type: String,
        required: false,
        default : "APP"
    },
    appScreenshot: {
        type: String,
        required : true
    }

}, {
    timestamps : true
}) 


const AppList = mongoose.model('AppList', appListSchema)
module.exports = AppList;
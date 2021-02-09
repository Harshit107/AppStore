const mongoose = require('mongoose');
require('dotenv').config();

const appDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    appImageId: {
        type: mongoose.Schema.Types.ObjectId,
        required : true, //        
    },
    appBaseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique : true
    }, //
    appAbout : {
        type: String,
        required : true, //
    },
    appDescription: {
        type: String,
        required : true
    },
    appFeature: {
        type: String,
    },
    appDownload: {
        type: String,
        default : 'N/A'
    },
    appRating: {
        type: String,
        default : 'N/A'
    },
    devEmail: {
        type: String,
        required: true
    },
    devWebsite: {
        type: String,
    },
    devPrivacy: {
        type: String,
        required: true
    },
    appType: {
        type: String,
        required: false,
        default : "APP"
    },
}, {
    timestamps : true
}) 


const appDetail = mongoose.model('AppDetail', appDetailSchema)
module.exports = appDetail;
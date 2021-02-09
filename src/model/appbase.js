const mongoose = require('mongoose');
require('dotenv').config();

const appBaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
    appUrl: {
        type: 'String',
        required: true,
    },
    appLocation: {
        type: 'String',
    },
    appVersion: {
        type: 'String',
        required: true,
    },
    appPackage: {
        type: 'String',
        required: true,
        unique : true
    },
   

}, {
    timestamps : true
}) 

appBaseSchema.virtual('appDetail', {
    ref: 'AppDetail',
    localField: '_id',
    foreignField: 'appBaseId'
})
appBaseSchema.virtual('appImage', {
    ref: 'AppImage',
    localField: '_id',
    foreignField: 'appBaseId'
})
const AppBase = mongoose.model('AppBase', appBaseSchema)
module.exports = AppBase;
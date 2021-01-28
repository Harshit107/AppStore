const mongoose = require('mongoose');
require('dotenv').config();

const appBaseSchema = new mongoose.Schema({
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
    },
   

}, {
    timestamps : true
}) 


const AppBase = mongoose.model('AppBase', appBaseSchema)
module.exports = AppBase;
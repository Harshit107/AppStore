const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL_DEV,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex: true,
    autoIndex: true, 
},
    () => console.log(''))
 
    


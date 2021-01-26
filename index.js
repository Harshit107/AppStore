const express = require('express');
require('./src/db/connect.js')

//import routes
const authRoute = require('./src/router/auth')
const test = require('./src/router/test')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())


app.use('/api/client', authRoute);
app.use('/test', test);




app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


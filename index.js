const express = require('express');
require('./src/db/connect.js')
const authRoute = require('./src/auth/auth')
const test = require('./src/router/test')
const userRouter = require('./src/router/userRouter')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use('/developer', authRoute);
app.use(userRouter)
app.use('/test', test);


app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


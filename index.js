const express = require('express');
require('./src/db/connect.js')
const userRouter = require('./src/router/userRouter')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use(userRouter)

app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


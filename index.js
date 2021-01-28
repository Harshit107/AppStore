const express = require('express');
require('./src/db/connect.js')
const authRoute = require('./src/auth/auth')
const userRouter = require('./src/router/userRouter')
const developerRouter = require('./src/router/developerRouter')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use(authRoute);
app.use(userRouter)
app.use("/developer",developerRouter)


app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


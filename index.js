const express = require('express');
require('./src/db/connect.js')
<<<<<<< HEAD

//import routes
const authRoute = require('./src/router/auth')
const test = require('./src/router/test')

=======
const userRouter = require('./src/router/userRouter')
>>>>>>> upstream/main
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

<<<<<<< HEAD
app.use(express.json())


app.use('/api/client', authRoute);
app.use('/test', test);



=======
app.use(userRouter)
>>>>>>> upstream/main

app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


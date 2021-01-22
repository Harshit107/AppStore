const express = require('express');
require('./src/db/connect.js')

const app = express();
const PORT = process.env.PORT || 3000;







app.listen(PORT, () => {
    console.log("Port is up On 3000")
})


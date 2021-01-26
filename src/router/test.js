const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res)=>{
    res.json({
        check: {
            message: "Yaa baby, auth token available, you have passed!"
        }
    })
})
module.exports = router; 
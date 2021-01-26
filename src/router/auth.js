const router = require('express').Router();
const Client = require('../model/client');

router.post('/signup', async (req, res)=>{
    const client = new Client({
        name: req.body.name,
        website: req.body.website,
        email: req.body.email,
        password: req.body.password,
    });

    try{
        const saveClient = await client.save()
        res.send(saveClient);
    }catch(err){
        res.status(400).send(err)
    }

})

module.exports = router;
const router = require('express').Router();
const Client = require('../model/client');

const {
    loginValidation,
    signupValidation
} = require('./validation');



router.post('/signup', async (req, res) => {

    const { error } = signupValidation(req.body);

    if (error)
        return res.status(400).send({
            error: error.details[0].message
        })
   
    try {
        const emailExist = await Client.findOne({
            email: req.body.email
        })
        if (emailExist)
        return res.status(400).send({
            error: 'User is already registed with this email!'
        })
        const client = new Client(req.body);
        //saving user
        await client.save();
        //generating token and saving it ->client model
        const token = await client.generateToken();
    
        res.send({
            message: client
        });
    } catch (error) {
        res.status(400).send({ error });
    }
    
    //new client
   
     
});


router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send({
            error: error.details[0].message
        })
    try {

        const client = await Client.findByCredentails(req.body);
        if (!client)
            return res.status(400).send({ error: 'Invalid password' });
        //generating token and saving it
        const token =await client.generateToken();
        res.send({
            token,
            client
        });
        
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    



})
module.exports = router;
const router = require('express').Router();
const User = require('../model/user');

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
        const emailExist = await User.findOne({
            email: req.body.email
        })
        if (emailExist)
        return res.status(400).send({
            error: 'User is already registed with this email!'
        })
        const client = new User(req.body);
        //saving user
        await client.save();
        //generating token and saving it ->client model
        const token = await client.generateToken();
    
        res.status(201).send({
            message: client._id,
            token
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

        const user = await User.findByCredentails(req.body);
        if (!user)
            return res.status(400).send({ error: 'Invalid password' });
        //generating token and saving it
        const token =await user.generateToken();
        res.status(200).send({
            token,
            message : user._id
        });
        
    } catch (error) {
        console.log(error)
        res.status(400).send({error : 'Invalid userId or password'});
    }
    



})

module.exports = router;
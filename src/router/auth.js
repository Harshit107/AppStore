const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../model/client');
const {loginValidation, signupValidation} = require('../model/validation');




router.post('/signup', async (req, res)=>{
    const {error} = signupValidation(req.body)     //check all field validation
    const emailExist = await Client.findOne({email: req.body.email}); //check same email already exist on database

    if(error) {
        res.status(400).send(error.details[0].message);
    }else if(emailExist){
        res.status(400).send('Email already exists');
    }
    else{
        //password hashing
        const prehash = await bcrypt.genSalt(5);
        const hashPass = await bcrypt.hash(req.body.password, prehash);


        const client = new Client({
            name: req.body.name,
            website: req.body.website,
            email: req.body.email,
            password: hashPass,
        });
        const saveClient = await client.save();
    
        try{
            res.send(saveClient);
        }catch(err){
            res.status(400).send(err)
        }
    }
    

})

router.post('/login',async (req, res)=>{
    const {error} = loginValidation(req.body);
    const emailExist = await Client.findOne({email: req.body.email})

    if(error) {
        res.status(400).send(error.details[0].message)
    }else if(!emailExist){
        res.status(400).send('You are not exist on database. You had to Sign up first!')
    }else{
        const validPass = await bcrypt.compare(req.body.password, emailExist.password);
        if(!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({_id: Client._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);

        res.send('You are logged in baby!');
    }

})
module.exports = router;
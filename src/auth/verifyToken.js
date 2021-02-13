const jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports = async (req, res, next)=> {
    try {

        let token = req.header('Authorization');
        
        if (!token || !token.includes('Bearer '))
            return res.status(401).send({ error: "Authentication required" })
        
        token = token.replace('Bearer ', '');

        if (token == -1)
            return res.status(401).send({ error: "Authentication required" })
        
        const decode = jwt.verify(token, process.env.TOKEN_SECRET)
        
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        
        if(!user)
            return res.status(401).send({ error: 'Authentication Required' })
        
        // if(!user.isVerified)
        //     return res.send({ error: 'Email is Not Verified', status: 403 })
        
        req.user = user
        req.token = token    
        next()
        } catch (error) {
            console.log({error})
            res.status(401).send({error:``})
        }
    
}
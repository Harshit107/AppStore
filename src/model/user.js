const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    website: {
        type: String,
        min: 10
    },
    email: {
        type: String,
        required: true,
        min: 5,
        unique: true
    },
    isVerified: {
        type: Boolean,
      default: false  
    },
    password: {
        type: String,
        required: true,
        max: 1000,
        min: 6
    },
    tokens: [{
        token: {
            required: true,
            type: String
        }
    }],
    liveApps: [{
        appId: {
            required: true,
            type: String
        }
    }],
    draftApps: [{
        appId: {
            required: true,
            type: String
        }
    }]
}, {
    timestamps : true,
})



//check user id and password
userSchema.statics.findByCredentails = async ({ email, password })=>{
    const user = await User.findOne({ "email": email })
    if(!user)
        throw new Error('No Email Found');    
    const checkPassworMatch = await bcrypt.compare(password,user.password)
    if(!checkPassworMatch){
        throw new Error('Invalid Password')
    }
    return user;
}

//generate token and save to database
userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.TOKEN_SECRET)
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token;
}

//pre check password on saveClient
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User =  mongoose.model('User', userSchema);
module.exports = User;

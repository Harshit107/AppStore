const AppList = require('../model/appList');
const AppBase = require('../model/appbase');
const User = require('../model/user');
const express = require('express');
const router = new express.Router();
const auth = require('../auth/verifyToken')


router.post('/upload/apphome', auth, async (req, res) => {

    const detail = {
         appName : "App Name",
         companyName :"Harshit Keshari",
         appSize : "45",
         appDownload : "0",
         appRating : "0.0",
         appIcon : "default",
         appUrl : "appstore.tech",
         appVersion : "1.0.0",
         appId: "123456",
        ...req.body,
    }   
    try {
        const app = await new AppList(detail);
        await app.save()
        res.send(app);
    } catch (error) {
        console.log({error})
        res.send(
            error
        )
    }
   
})

router.post('/upload/appbase', auth, async (req, res) => {

    try {
        const appbase = await new AppBase(req.body);
        await appbase.save();
        const user = await User.findById(req.user._id);
        user.draftApps = user.draftApps.concat({
            appId :  appbase._id
        })
        await user.save()
        res.status(200).send({
            appId : appbase._id
        })
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }
})

router.post('/upload/appbase/get', async (req, res) => {

    try {
        const appId  = req.body.appId;
        console.log(appId);
        const appBase = await AppBase.findById(appId)
        res.status(200).send(appBase)
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
    
})

module.exports = router;
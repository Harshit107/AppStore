const AppList = require('../model/appList');
const auth = require('../auth/verifyToken');
const express = require('express');
const router = new express.Router();


router.get('/applist', async (req, res) => {

    const detail = {
         appName : "PicHub",
         companyName :"H Keshari",
         appSize : "25",
         appDownload : "1015",
         appRating : "4.5",
         appIcon : "default",
         appUrl : "abc.com",
         appVersion : "1.0.2",
         appId : "123456",
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

router.get('/applist/search', async(req, res) => {
    const appName = req.query.app || '';
    try {

        const searchResult = await AppList.find({ appName : new RegExp(appName, "i") });
        if (searchResult.length == 0)
            return res.status(404).send({ error: "No app found" });
        res.send({message : searchResult})
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }

})

module.exports = router;
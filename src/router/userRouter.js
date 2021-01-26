const AppList = require('../model/appList');
const express = require('express');
const router = new express.Router();


router.get('/applist', async (req, res) => {

    const detail = {
         appName : "Uem Connect",
         companyName :"Harshit",
         appSize : "45",
         appDownload : "125",
         appRating : "4.2",
         appIcon : "default",
         appUrl : "abc.com",
         appVersion : "1.2.2",
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

router.get('/applist/search',async(req, res) => {
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
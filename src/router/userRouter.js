const AppList = require('../model/appList');
const express = require('express');
const router = new express.Router();


router.get('/upload/app', async (req, res) => {

    const detail = {
         appName : "Uem Connect",
         companyName :"Harshit",
         appSize : "45",
         appDownload : "125",
         appRating : "4.2",
         appIcon : "default",
         appUrl : "abc.com",
         appVersion : "1.2.2",
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

module.exports = router;
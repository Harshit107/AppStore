const express = require('express');
const router = new express.Router();
const AppList = require('../model/appList');
const AppBase = require('../model/appbase');
const AppDetail = require('../model/appDetail');
const User = require('../model/user');
const AppImage = require('../model/appImage');

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

router.get('/store/search', async(req, res) => {
    const appName = req.query.app || '';
    try {
        // return res.status(404).send({message : "No app found"})
        const searchResult = await AppList.find({ appName : new RegExp(appName, "i") });
        if (searchResult.length == 0)
            return res.status(404).send({ error: "No app found" });
        res.send({message : searchResult})
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error})
    }

})

router.get('/store/appdetail/',  async (req, res) => {

    try {
        const appPackage = req.query.app;
        // console.log(appPackage)
        const {appId : appBaseId } = await AppList.findOne({appPackage })
        const appDetailInfo = await AppDetail.findOne({appBaseId });
        if (!appDetailInfo)
            return res.status(404).send({ error: 'No such App found ' });
        
        const appBaseInfo = await AppBase.findById(appBaseId)
        const appImageInfo = await AppImage.findOne({ appBaseId })
        const appRating = await AppList.findOne({ appPackage }).select('appRating');
        console.log(appRating.appRating.rating)

        const message = {
            appBase: appBaseInfo,
            appImage: appImageInfo,
            appDetail: appDetailInfo,
            appRating : appRating.appRating.rating
        }
        res.status(200).send({message});
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})

router.get('/store/hint', async (req, res) => {
    const hint = req.query.hint || "";
    const searchResult = await AppList.find({ appName: new RegExp(hint, "i") }).limit(6).select('appName appPackage appIcon');
        if (searchResult.length == 0)
            return res.status(404).send({ error: "No app found" });
        res.send({message : searchResult})
})


router.post('/store/app/rating', async (req, res) => {

    try {
        console.log(req.body)
        const { IMEI, appPackage, rating, message } = req.body;
        if (IMEI == undefined || appPackage == undefined || rating == undefined ) {
            return res.status(404).send({message : "Insufficient detail provided."})
        }
        const app = await AppList.findOne({ appPackage })

        app.appRating.users = app.appRating.users.concat({
            IMEI,
            rating,
            message
        })
        app.appRating.rating =parseInt(((parseInt(rating) + app.appRating.rating*(app.appRating.users.length-1))/app.appRating.users.length)*100)/100;
        await app.save();
        res.status(200).send({message : "Success"})

    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }    

})

router.post('/store/app/rating/get', async (req, res) =>{
    try {
        const IMEI = req.body.IMEI;
         const appPackage = req.body.appPackage;
    if (!IMEI)
        return res.status(404).send({ error: "Unique Id recognition failed!" })
    
         const rating = await AppList.findOne({ appPackage })
    // console.log(rating)
        const myRating = rating.appRating.users.filter(rating => rating.IMEI == IMEI)
        if (myRating.length === 0) {
            console.log({ message: myRating })   
            return res.status(200).send({ message: { rating: "0", message: "" } })
        }
       
        res.status(200).send({ message: myRating[0] })
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
    

})

router.post('/store/app/download', async (req, res) => {

    try {
        const { appPackage } = req.body;
        if (appPackage == undefined ) {
            return res.status(404).send({message : "Insufficient detail provided."})
        }
        const app = await AppList.findOne({ appPackage })
        app.appDownload = parseInt(app.appDownload) + 1
        await app.save();
        res.status(200).send({message : "Success"})

    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }    

})


module.exports = router;
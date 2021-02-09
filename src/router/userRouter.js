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

router.get('/app/appdetail/get',  async (req, res) => {

    try {
        const appPackage = req.query.app;
        // console.log(appPackage)
        const {appId : appBaseId } = await AppList.findOne({appPackage })
        const appDetailInfo = await AppDetail.findOne({appBaseId });
        if (!appDetailInfo)
            return res.status(404).send({ error: 'No such App found ' });
        
        const appBaseInfo = await AppBase.findById(appBaseId)
        const appImageInfo = await AppImage.findOne({appBaseId})
        const message = {
            appBase: appBaseInfo,
            appImage: appImageInfo,
            appDetail : appDetailInfo
        }
        res.status(200).send({message});
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})

router.get('/applist/hint', async (req, res) => {
    const hint = req.query.hint || "";
    const searchResult = await AppList.find({ appName: new RegExp(hint, "i") }).limit(6).select('appName appPackage appIcon');
        if (searchResult.length == 0)
            return res.status(404).send({ error: "No app found" });
        res.send({message : searchResult})
})


module.exports = router;
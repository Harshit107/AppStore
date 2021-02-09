const express = require('express');
const router = new express.Router();
const auth = require('../auth/verifyToken')
const AppList = require('../model/appList');
const AppBase = require('../model/appbase');
const AppDetail = require('../model/appDetail');
const User = require('../model/user');
const AppImage = require('../model/appImage');



//profile
router.get('/profile',auth, async (req, res) => {
    res.status(200).send({message : req.user});
})

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

//basic  upload
router.post('/upload/appbase', auth, async (req, res) => {


    try {
        const appbase = await new AppBase({
            ...req.body,
            userId : req.user._id
        });
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
        const appBase = await AppBase.findById(appId)
        res.status(200).send({message : appBase})
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
    
})

router.post('/upload/appbase/remove', async (req, res) => {

    try {
        const appId = req.body.appId;
        if (!appId)
            return res.status(404).send({ error: "AppId is required" });
        const appBase = await AppBase.findById(appId)
        if (!appBase)
            return res.status(404).send({ error: "No app found with the appId" })
        await appBase.remove();
        res.status(200).send({message : "Success"})
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
    
})

//image upload
router.post('/upload/appimage', auth,  async (req, res) => {
    try {
        const check = await AppImage.find({appBaseId : req.body.appBaseId});
        if (check.length > 0)
            return res.status(404).send({ error: 'You can upload images maximum once! try edit image' });
        
        const resultAppImage = await new AppImage({
            ...req.body,
            userId: req.user._id
        })
        if (!resultAppImage)
            res.status(400).send({ error: 'Image not uploaded!' });
        await resultAppImage.save();
        res.send({message : resultAppImage._id})
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }



})

router.post('/upload/appimage/edit', auth, async (req, res) => {
    try {
        const {backgroundImage =[], icon='', screenshot=[] } = req.body
        let resultAppImage = await AppImage.findOne({ appBaseId: req.body.appBaseId });
        if (!resultAppImage)
            return res.status(404).send({ error: 'No such App found' });
        
        resultAppImage.backgroundImage = backgroundImage;
        resultAppImage.screenshot = screenshot;
        resultAppImage.icon = icon;

        console.log(resultAppImage)

        await resultAppImage.save();
        res.status(200).send({ message: resultAppImage })

    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})

router.post('/upload/appimage/get', auth, async (req, res) => {

    try {
        let resultAppImage = await AppImage.findOne({appBaseId : req.body.appBaseId});
        if (!resultAppImage)
            return res.status(404).send({ error: 'No such App found ' });
        res.status(200).send({ message: resultAppImage });
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})

//app detail
router.post('/upload/appdetail', auth, async (req, res) => {
    try {
        const { appBaseId } = req.body;
        const ifExist = await AppDetail.find({ appBaseId })
        if (ifExist.length > 0)
            return res.status(400).send({error : "App already exist with this Id"})

        const appImageId = await AppImage.findOne({ appBaseId })

        const resultApp = await new AppDetail({ 
            ...req.body,
            appImageId: appImageId._id,
            userId : req.user._id
        })
        await resultApp.save();
        const appBaseInfo = await AppBase.findById(appBaseId)
     
        const message = {
            ...appBaseInfo._doc,
            ...resultApp._doc,
            appIcon : appImageId.icon,
            appId : appBaseId
        }
        // console.log(message)
        const app = await new AppList(message)
        await app.save();
        //remove from draft to liveApps
        const user = req.user;
        user.draftApps = user.draftApps.filter(appId => {            
            return appId.appId === appBaseId;
        })
        await user.save();

        
        res.status(200).send({message : app})

    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error.message})
    }



})

router.post('/upload/appdetail/get',  async (req, res) => {

    try {
        const appBaseId = req.body.appBaseId;
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

//check package Name
router.post('/package/check',  async (req, res) => {
    const { appPackage } = req.body
    if (!appPackage)
        return res.status(404).send({ error: "package name can't be empty" })
    const isAvailable = await AppBase.findOne({ appPackage })
    if (isAvailable)
        return res.status(400).send({ error: "Package name is already in use, try with different package name" })
    res.status(200).send({message : 'Available'})
})

//dashboard
router.get('/app/published',auth, async(req, res) => {
    try {
        const searchResult = await AppList.find({ userId : req.user._id });
        if (searchResult.length == 0)
            return res.status(404).send({ error: "No app found" });
        res.send({message : searchResult})
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }

})



module.exports = router;
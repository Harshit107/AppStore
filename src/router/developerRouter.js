const express = require('express');
const router = new express.Router();
const auth = require('../auth/verifyToken')
const AppList = require('../model/appList');
const AppBase = require('../model/appbase');
const AppDetail = require('../model/appDetail');
const User = require('../model/user');
const AppImage = require('../model/appImage');
const fetch = require('node-fetch')



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
//basic  version
router.post('/upload/appbase/version', auth, async (req, res) => {

    const appId = req.body.appId;
    if (!appId)
        return res.status(404).send({ error: " Insufficient data provided."})
    try {
        let appbase = await AppBase.findById(appId)
        if (!appbase)
            return res.status(404).send({ error: "No app found." })

        appbase.appVersion = req.body.appVersion;
        appbase.appSize = req.body.appSize;
        appbase.appUrl = req.body.appUrl;
        appbase.appLocation = req.body.appLocation;
        await appbase.save();
        
        let liveApp = await AppList.findOne({ appPackage: req.body.appPackage });
        liveApp.appVersion = req.body.appVersion;
        liveApp.appSize = req.body.appSize;
        liveApp.appUrl = req.body.appUrl;
        liveApp.appLocation = req.body.appLocation;
        liveApp.save();
        res.status(200).send({
            appId : appbase._id
        })
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }
})
//edit
router.post('/upload/appbase/edit', auth, async (req, res) => {

    const appId = req.body.appId;

    if (!appId)
        return res.status(404).send({ error: " Insufficient data provided."})
    try {
        let appbase = await AppBase.findById(appId)
        if (!appbase)
            return res.status(404).send({ error: "No app found." })

        appbase.appVersion = req.body.appVersion;
        appbase.appSize = req.body.appSize;
        appbase.appUrl = req.body.appUrl;
        appbase.appLocation = req.body.appLocation;
        appbase.appName = req.body.appName;
        appbase.appCompany = req.body.appCompany;
        await appbase.save();
        // console.log(appbase)
        res.status(200).send({
            appId : appbase._id
        })
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }
})
//get 
router.post('/upload/appbase/get', async (req, res) => {

    try {
        const appId = req.body.appId;
        // console.log(appId)
        if (!appId)
            return res.status(400).send({ error: "Insufficient data provided." });
        const appBase = await AppBase.findById(appId)
        // console.log(appBase)
        res.status(200).send({message : appBase})
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
})
//remove
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

/*////////////////////////**************************** */
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
//image edit
router.post('/upload/appimage/edit', auth, async (req, res) => {
    try {
        const {backgroundImage =[], icon='', screenshot=[] } = req.body
        let resultAppImage = await AppImage.findOne({ appBaseId: req.body.appBaseId });

        if (!resultAppImage) {
            const newImage = await new AppImage({
                ...req.body,
                userId: req.user._id
            })
            if (!newImage)
                res.status(400).send({ error: 'Image not uploaded!' });
            await newImage.save();
            return res.send({message : newImage._id})
        }

        resultAppImage.backgroundImage = backgroundImage;
        resultAppImage.screenshot = screenshot;
        resultAppImage.icon = icon;
        // console.log(resultAppImage)

        await resultAppImage.save();
        res.status(200).send({ message: resultAppImage })

    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})
//image get
router.post('/upload/appimage/get', auth, async (req, res) => {

    try {
        let resultAppImage = await AppImage.findOne({appBaseId : req.body.appBaseId});
        if (!resultAppImage)
            return res.status(404).send({ error: 'No Save data found ' });
        // console.log(resultAppImage)
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
            appId: appBaseId,
            appDownload : 0,
            appRating : 0,
        }
        // console.log(message)
        const app = await new AppList(message)
        await app.save();
        //remove from draft to liveApps
        const user = req.user;
        user.draftApps = user.draftApps.filter(appId => { 

            return appId.appId !== appBaseId;
        })
        await user.save();

        
        res.status(200).send({message : app})

    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error.message})
    }



})
//app detail get
router.post('/upload/appdetail/get',  async (req, res) => { 

    try {
        const appBaseId = req.body.appBaseId;
        const appDetailInfo = await AppDetail.findOne({appBaseId });
        if (!appDetailInfo)
            return res.status(404).send({ error: 'All fields are required!' });
        // console.log(appDetailInfo)
        res.status(200).send({message : appDetailInfo});
        
    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error})
    }

})
//app edit
router.post('/upload/appdetail/edit', auth, async (req, res) => {
    try {
        const { appBaseId } = req.body;
        const { appPackage } = await AppBase.findById(appBaseId).select('appPackage');
        const resultApp = await AppDetail.findOne({ appBaseId })
        const myLiveApp = await AppList.findOne({ appPackage })

        if (!resultApp ) {
            const url = 'http://localhost:3000/developer/upload/appdetail'
            const result = await fetch(url, {
                method: 'post',
                body: JSON.stringify(req.body),
                headers: req.headers
            });
            if(result.status === 200)
                return res.status(200).send({ message: result })          
            return res.status(result.status).send({error : "App not published"})
                
        }      
        console.log(appPackage);

        resultApp.appAbout = req.body.appAbout;
        resultApp.appDescription = req.body.appDescription;
        resultApp.appFeature = req.body.appFeature;
        resultApp.devEmail = req.body.devEmail;
        resultApp.devWebsite = req.body.devWebsite;
        resultApp.devPrivacy = req.body.devPrivacy;
        await resultApp.save();
        

        const appBaseInfo = await AppBase.findById(appBaseId)
        const { icon : appIcon} = await AppImage.findOne({ appBaseId }).select('icon')
   
        // console.log(message)
        // myLiveApp
        if (!myLiveApp) {
            
            const message = {
                ...appBaseInfo._doc,
                ...resultApp._doc,
                appIcon,
                appId: appBaseId,
                appDownload : 0,
                appRating : 0,
            }
            const publishNewApp = await new AppList(message);
            await publishNewApp.save();
            // console.log(publishNewApp);
            return res.status(200).send({message : publishNewApp})

        }

        myLiveApp.appAbout = req.body.appAbout;
        myLiveApp.appDescription = req.body.appDescription;
        myLiveApp.appFeature = req.body.appFeature;
        myLiveApp.devEmail = req.body.devEmail;
        myLiveApp.devWebsite = req.body.devWebsite;
        myLiveApp.devPrivacy = req.body.devPrivacy;
        
        myLiveApp.appName = appBaseInfo.appName;
        myLiveApp.companyName = appBaseInfo.companyName;
        myLiveApp.appIcon = appIcon,
        myLiveApp.appUrl = appBaseInfo.appUrl;
        myLiveApp.appVersion = appBaseInfo.appVersion;
        await myLiveApp.save();

        // console.log(myLiveApp);

        //remove from draft to liveApps
        const user = req.user;
        user.draftApps = user.draftApps.filter(appId => { 
            return appId.appId !== appBaseId;
        })
        await user.save();
        res.status(200).send({message : myLiveApp})

    } catch (error) {
        console.log({ error })
        res.status(404).send({error: error.message})
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

//draft app
router.get('/app/draft', auth, async (req, res) => {

    try {
        const publishedApp = await AppList.find({ userId: req.user._id });
        let totalApp = await AppBase.find({ userId : req.user._id })
        const draftApp = [];
        totalApp = totalApp.forEach(app => {
            const appPackage = app.appPackage;
            var found = false;
            for(var i = 0; i < publishedApp.length; i++) {
                if (publishedApp[i].appPackage == appPackage) {
                    found = true;
                    break;
                }
            }
            if(!found)
                draftApp.push(app)
        })
        // console.log({message : draftApp})
        res.send({message : draftApp})
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }


})

// delete app
router.post('/app/delete', auth, async (req, res) => {
    
    try {
        const appId = req.body.appId;
        if (!appId)
            return res.status(404).send({ error: "Insufficient data provided." });
        const app = await AppList.findOneAndDelete({ appId });
        res.status(200).send({message : "Success"})
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
})
//delete draft app
router.post('/draftapp/delete', auth, async (req, res) => {
    
    try {
        const appId = req.body.appId;
        if (!appId)
            return res.status(404).send({ error: "Insufficient data provided." });
        const app = await AppBase.findByIdAndDelete(appId);
        res.status(200).send({message : "Success"})
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }
})


/**********     Logout      ************** */

//logout
router.get('/account/logout',auth, async(req, res) => {
    try {
        
        const user = await User.findById(req.user._id);
        user.tokens = user.tokens.filter(token => req.token != token.token);
        await user.save();
        res.status(200).send({message : "Success!"});
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }

})

//logout from all
router.get('/account/logout/all',auth, async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.tokens = [];
        await user.save();
        res.status(200).send({ message: "Success!" });
        
    } catch (error) {
        console.log({ error })
        res.status(400).send({error})
    }

})

/*
        let liveApp = await AppList.findOne({ appPackage: req.body.appPackage });
        
        liveApp.appVersion = req.body.appVersion;
        liveApp.appSize = req.body.appSize;
        liveApp.appUrl = req.body.appUrl;
        liveApp.appLocation = req.body.appLocation;
        liveApp.appName = req.body.appName;
        liveApp.appCompany = req.body.appCompany;

        liveApp.save();
*/

module.exports = router;
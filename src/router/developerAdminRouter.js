const express = require('express');
const router = new express.Router();
const auth = require('../auth/verifyToken')
const AppList = require('../model/appList');
const ImageSlider = require('../model/imageSlider');
const AppBase = require('../model/appbase');
const AppDetail = require('../model/appDetail');
const User = require('../model/user');
const AppImage = require('../model/appImage');



router.get('/admin/app/home/imageslider', async (req, res) => {

    try {
        const message = await ImageSlider.find().sort({timestamp : 1});
        res.send({message})

    } catch (error) {
        console.log(error)
        res.status(404).send({ error})
    }


})

router.get('/admin/uploadimage', async (req, res) => {

    const image = 
    "https://firebasestorage.googleapis.com/v0/b/appstore-in.appspot.com/o/Admin%2Fimageslider%2Fimg2.png?alt=media&token=38693a10-c8c0-47a5-8cc7-00cc48de84c0"
    const link = await new ImageSlider({ image });
    await link.save();
    res.status(200).send(link)
})

// router.get("/", async (req, res) => {
    
//     try {
//         const allApp = await AppList.find();
        
//         for (let i = 0; i < allApp.length; i++) {
//             allApp[i].userId = "601ee1f095e3ed080ce93b20";
//             await allApp[i].save();
//         }
//         // await allApp.save();
//         res.status(200).send({ allApp })
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({error})
//     }
// })


router.get('/authcheck',auth, async (req, res) => {

    res.status(200).send({message : "ok"})

})

router.get('/startserver', async (req, res) => {
    res.status(200).send({message : "server started"})
})



module.exports = router
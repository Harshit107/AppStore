const mongoose = require('mongoose');


const mongooseSchema = new  mongoose.Schema({
    image: {
        type: String,
        required: true
    }
})




const ImageSlider = mongoose.model('ImageSlider', mongooseSchema);
module.exports = ImageSlider;
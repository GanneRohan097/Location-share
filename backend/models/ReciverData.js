const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema({
    code:{
        type:Number,
        required:true
    },
    name:{
     type:String,
     required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    latitude:{
        type:Number,
        required:true
    }
});
module.exports=mongoose.model('ReceiverData',receiverSchema);
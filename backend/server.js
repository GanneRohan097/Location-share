const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./models/locationModel')
const ReceiverData = require('./models/ReciverData');
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Backend running");
});

app.post('/share',async (req,res)=>{
    console.log(req.body);
    const incomingData = req.body;
    const existingLocation = await Location.findOne({
        code:incomingData.code
    }
        
    );
    if(existingLocation){
        existingLocation.latitude=incomingData.latitude;
        existingLocation.longitude=incomingData.longitude;
        await existingLocation.save();
    }
    else{
        const newLocation = new Location(incomingData);
        await newLocation.save();
    }
    res.send("Location received");
})

app.post('/receive',async (req,res)=>{
        const code = req.body.code;
        console.log(code);
        const location = await Location.findOne({
            code:code
        });
        if(location){
            res.json(location)
        }
        else{
            res.send("Incorrect");
        }

})

app.post('/receiverShare', async(req,res)=>{
    const {code , name , longitude , latitude} = req.body;
    console.log("Body:",req.body);
    let receiver = await ReceiverData.findOne({
        code: code
    })
    if(receiver){
        receiver.name=name;
        receiver.longitude = longitude;
        receiver.latitude = latitude;
        await receiver.save();
    }
    else{
        receiver = new ReceiverData({
            code,
            name,
            longitude,
            latitude
        });
         await receiver.save();
    }
     res.send("Receiver location saved");
     console.log("Location saved");
});

app.post('/sendReceiver',async(req,res)=>{
      const {code} = req.body;
      const receiver = await ReceiverData.findOne({
        code: code
      });
      if(receiver){
        res.json(receiver);
      }
      console.log("Location received in sender page");
})

app.delete('/delete/:code',async (req,res)=>{
     const code = req.params.code;
     await Location.deleteOne({
        code:code
     });
     await ReceiverData.deleteOne({
        code:code
     })
     res.send("Location deleted");
})
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})
app.listen(7000,()=>{
    console.log("Server running on port 7000");
});
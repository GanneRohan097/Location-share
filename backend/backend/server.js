const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./models/locationModel')
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
            res.status(404).send("Incorrect code or location not found");
        }

})
app.delete('/delete/:code',async (req,res)=>{
     const code = req.params.code;
     await Location.deleteOne({
        code:code
     });
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
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Driver = require('./models/driver');

const app = express();


// connect to MongoBD
var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_GRAY_URI || 'mongodb://localhost/uber-app';
mongoose.connect(uristring, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});
mongoose.connection.once('open',() => {
    console.log('MongoDB is running ya som3a!');
}).on('error',(error) => {
    console.log('MongoDB is NOT running ya A7A! : ',error);
})

// Middlewares
app.use(bodyParser.json());
app.use(cors());




// check root
app.get('/',(req,res) => {
    res.send('It is Working!')
})

// show all drivers
app.get('/drivers/all',(req,res) => {
    Driver.find({})
    .then(drivers => res.json(drivers))
    .catch(err => res.send('There is no drivers availabe!'))
})

// add driver
app.post('/drivers',(req,res) => {
    Driver.create(req.body)
    .then(newDriver => res.json(newDriver))
    .catch(err => res.json(err.message))
})

// show availabe drivers 
app.get('/drivers',(req,res) => {
    let availabeDrivers = [];
    Driver.aggregate(
        [{
            $geoNear: {
                near: { type: "Point", coordinates: [ Number(req.query.x) , Number(req.query.y) ] },
                distanceField: "dist.calculated",
                maxDistance: 800000,
                includeLocs: "dist.location",
                spherical: true
            }
        }],
        (err,drivers) => {
            if(err) {
                res.json('error ya som3a!');
            } else {
                drivers.forEach(driver => {
                    if(driver.availabe)
                        availabeDrivers.push(driver);
                });
                console.log(availabeDrivers.length)
                res.json(availabeDrivers)
            }
        }
    )
})

// delete driver
app.delete('/drivers/:id',(req,res) => {
    Driver.findByIdAndDelete({_id: req.params.id})
    .then(deletedDriver => res.json(deletedDriver))
    .catch(err => res.json(err))
})

// reset database
app.delete('/delete',(req,res) => {
    Driver.deleteMany({}).then(res.json('Success'))
})

//update driver
app.put('/drivers/:id',(req,res) => {
    Driver.findByIdAndUpdate({_id: req.params.id},req.body)
    .then(outdatedDriver => Driver.findOne({_id: req.params.id}))
    .then(updatedDriver => res.json(updatedDriver))
    .catch(err => res.json(err.message))
})



app.listen(process.env.PORT || 4000,() => {
    console.log(`app is running on port ${process.env.PORT}`);
});
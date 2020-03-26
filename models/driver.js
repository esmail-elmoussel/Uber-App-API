const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create geojson Schema (Optional)
const GeoSchema = new Schema({
    type: {                         // type of GeoJSON..
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"           // type of the map we are using!
    }
})

// Create driver Schema
const DriverSchema = new Schema({
    name: {
        type: String,
        required: [true,'Name is requird!']
    },
    rate: {
        type: Number
    },
    availabe: {
        type: Boolean,
        default: false
    },
    geometry: GeoSchema
})

// Create Driver model
const Driver = mongoose.model('driver',DriverSchema);

module.exports = Driver;
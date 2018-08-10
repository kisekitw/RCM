const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DeviceSchema = new Schema({
    devName:{
        type: String,
        required: true
    },
    devIP:{
        type: String, 
        required: true
    },
    devPort: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    createUser: {
        type: String,
        required: true
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    updateUser: {
        type: String,
        required: true
    }
});

mongoose.model('Devices', DeviceSchema);
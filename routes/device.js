const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Device Model
require('../models/device');
const Device = mongoose.model('Devices');

// Device Index Page
router.get('/', (req, res) => {
    Device.find({})
        .sort({ updateDate: 'desc'})
        .then(devices => {
            res.render('device/index', {
                devices: devices
            });
        });
});

// Add Device Form
router.get('/add', (req, res) => {
    res.render('device/add');
});

// Edit Device Form
router.get('/edit/:id', (req, res) => {
    Device.findOne({
        _id: req.params.id
    })
    .then(device => {
        res.render('device/edit', {
            device: device
        });
    })  
});

// Add Form Process
router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.devName) {
        errors.push({ text: 'Please enter the Device Name!' });
    } else if (!req.body.devIP) {
        errors.push({ text: 'Please enter the Device IP!' });
    } else if (!req.body.devPort) {
        errors.push({ text: 'Please enter the Device Port!' });
    }

    if (errors.length > 0) {
        res.render('device/add', {
            errors: errors, 
            devName: req.body.devName,
            devIP: req.body.devIP,
            devPort: req.body.devPort
        });
    } else {
        const addDevice = {
            devName: req.body.devName,
            devIP: req.body.devIP,
            devPort: req.body.devPort
        };

        new Device(addDevice)
            .save()
            .then((device) => {
                req.flash('success_msg', 'Device added.');
                res.redirect('/device');
            });
    }
});

// Edit Form Process 
router.put('/:id', (req, res) => {
    Device.findOne({
        _id: req.params.id
    })
    .then(device => {
        device.devName = req.body.devName,
        device.devIP = req.body.devIP,
        device.devPort = req.body.devPort,
        device.updateDate = Date.now(),
        device.updateUser = 'Admin'

        device.save()
            .then(device => {
                req.flash('success_msg', 'Device updated.');
                res.redirect('/device');
            });
    });  
});

// Delete Device
router.delete('/:id', (req, res) => {
    Device.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Device removed.');
        res.redirect('/device');
    });
});

module.exports = router;
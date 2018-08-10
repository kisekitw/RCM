const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
    res.render('user/login');
});

// User Register Route
router.get('/register', (req, res) => {
    res.render('user/register');
});

module.exports = router;
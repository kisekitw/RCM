const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Map global promise
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/RCMDB', {
    useNewUrlParser: true
})
    .then(() => console.log('mongodb connected...'))
    .catch((err) => console.log(err));

// Load Device Model
require('./models/device');
const Device = mongoose.model('Devices');

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) => {
    const title = 'Remote Control Management';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Device Form
app.get('/device/add', (req, res) => {
    res.render('device/add');
});

// Process Form
app.post('/device', (req, res) => {
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
                res.redirect('/device');
            });

    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Load routes
const deviceRoutes = require('./routes/device');
const userRoutes = require('./routes/user');

// Map global promise
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/RCMDB', {
    useNewUrlParser: true
})
    .then(() => console.log('mongodb connected...'))
    .catch((err) => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override Middleware
app.use(methodOverride('_method'))

// Express session Middleware
app.use(session({
    secret: '1qaz@WSX',
    resave: true,
    saveUninitialized: true
  }));

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

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

// Use routes
app.use('/device', deviceRoutes);
app.use('/user', userRoutes);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


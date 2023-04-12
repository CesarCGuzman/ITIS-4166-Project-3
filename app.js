// Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');

// Create express app
const app = express();

// Configure app
let port = 3000;
let host = 'localhost';
// %40 is used to replace an @ symbol in the password
let url = 'Your MongoDB string here'
app.set('view engine', 'ejs');

// Connect to database
mongoose.connect(url)
.then(() => {
    // Start the server
    app.listen(port, host, () => {
        console.log('Server is running on port: ', port);
    });
})
.catch(err => console.log(err.message));

// Mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Main routes
app.use('/', mainRoutes);

// Event routes
app.use('/events', eventRoutes);

// 404 error
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

// Error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', { error: err });
});
const http = require('http');
const path = require('path');
const methods = require('methods');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorhandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';

// Create global express server
const app = express();

// Normal express config defaults
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({secret: 'conduit', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

if (!isProduction) {
    app.use(errorhandler());
}

app.use((req, res, next) => {
    req.kabileonline = req.kabileonline || {};
    req.kabileonline.timerStart = process.hrtime();

    // add any helper, lib, anything to kabileonline object
    // so that api endpoints can use req.kabileonline.helper...

    res.on('finish', async () => {
        const timerRun = process.hrtime(req.kabileonline.timerStart);
        const timeTaken = (timerRun[0] * 1000) + (timerRun[1] / 1e6);

        console.info('Request finished in %s ms', Math.round(timeTaken * 100) / 100);
    });

    next();
});


// create a mysql db connection including models
const db = require('./models');

// initialize api routes, the core of backend
const router = require('./routes').init(db);
app.use(router);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + server.address().port);
});

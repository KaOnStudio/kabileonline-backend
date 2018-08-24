const router = require('express').Router();

// this file just adds '/api' to the urls
// we can use this file to implement a general error handling

module.exports.init = function (db) {
    const api = require('./api').init(db);
    router.use('/api', api);
    return router;
};


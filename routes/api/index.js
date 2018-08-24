const router = require('express').Router();

module.exports.init = function (db) {

    // add sub api files here
    router.use('/users', require('./users').init(db));

    return router;
};

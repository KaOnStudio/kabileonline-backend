const DataTypes = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

module.exports = (db) => {

    // define a database table
    return db.define('User',
        {
            // define columns as properties
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                //unique
                //required
                //create index
                //lowercase
            },
            bio: DataTypes.STRING,
            image: DataTypes.STRING,
            hash: DataTypes.STRING,
            salt: DataTypes.STRING,
        },
        {
            // define instance methods if necesarry
            // you can add classMethods as well..
            instanceMethods: {
                validPassword: function (password) {
                    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
                    return this.hash === hash;
                },
                setPassword: function (password) {
                    this.salt = crypto.randomBytes(16).toString('hex');
                    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
                },
                generateJWT: function () {
                    const today = new Date();
                    const exp = new Date(today);
                    exp.setDate(today.getDate() + 60);

                    return jwt.sign({
                        id: this._id,
                        username: this.username,
                        exp: parseInt(exp.getTime() / 1000),
                    }, secret);
                },
                toAuthJSON: function () {
                    return {
                        username: this.username,
                        email: this.email,
                        token: this.generateJWT(),
                        bio: this.bio,
                        image: this.image
                    };
                },
                toProfileJSONFor: function (user) {
                    return {
                        username: this.username,
                        bio: this.bio,
                        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
                        following: user ? user.isFollowing(this._id) : false
                    };
                }
            }
        }
    );
};

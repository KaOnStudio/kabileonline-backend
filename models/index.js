const Sequelize = require('sequelize');

// Set db parameters
const db_host = process.env.DB_HOST || 'localhost';
const db_name = process.env.DB_NAME || 'kaon_kabileonline';
const db_user = process.env.DB_USER || 'root';
const db_pass = process.env.DB_PASS || '';

// Init db connection
const db = new Sequelize(db_name, db_user, db_pass, {
    host: db_host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// init models
const User = require('./User')(db);
// const Town = require('./Town')(db);

// set relations between models
// Town.belongsTo(User);

// sync models to real db, force=true will recreate the db..
db.sync({force: true}).then(() => {
    console.log(`Database & tables created!`)
});

// passport validation thingy..
const passport = require('../helpers/passport')(User);

// return db connection
module.exports = db;

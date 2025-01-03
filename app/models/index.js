
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./auth.model.js")(sequelize, Sequelize);
db.url = require("./url.model.js")(sequelize, Sequelize);
db.analytics = require("./analytics.model.js")(sequelize, Sequelize)
db.user.hasMany(db.url, { foreignKey: 'userid', as: 'urls' });
db.url.belongsTo(db.user, { foreignKey: 'userid', as: 'user' });

db.url.hasMany(db.analytics, { foreignKey: 'shortUrlId', as: 'analytics' });
db.analytics.belongsTo(db.url, { foreignKey: 'shortUrlId', as: 'url' });

sequelize.sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database: ", err);
  });

module.exports = db;

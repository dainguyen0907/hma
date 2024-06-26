'use strict';

import 'dotenv/config';
import fs from "fs"
import path from 'path'
import { Sequelize } from 'sequelize';
import process from 'process';
const basename = path.basename(__filename);
const db = {};

const customizeConfig = {
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "dialect": "postgres",
  "logging": false
}
let sequelize = new Sequelize(process.env.DB_DATABSE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, customizeConfig)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

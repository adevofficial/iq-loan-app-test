'use strict';
import { pascalCase } from 'change-case';
import fs from 'fs';
import { isFunction } from 'lodash';
import path from 'path';
import Sequelize from 'sequelize';
import { paginate } from 'sequelize-paginate';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../../configs/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );

    paginate(model);

    model.model_name = pascalCase(model.name);

    db[model.model_name] = model;

    if (isFunction(model.versionsModel)) {
      db[`${model.model_name}Version`] = model.versionsModel();
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

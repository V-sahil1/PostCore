/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { configs } from "../../config/sql";
import { env } from "../../config/env.config";

const sequelizeConfig = configs[env.NODE_ENV];
console.log(sequelizeConfig);

if (!sequelizeConfig) {
  throw new Error(`Missing database configuration for env: ${env}`);
}

const basename = path.basename(__filename);
console.log(basename);
console.log(__filename);

interface DB {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db = {} as DB;

/**
 * Create Sequelize instance
 */
const sequelize = new Sequelize(

  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: 'mysql',
    logging: false,
  }
);
 console.log(sequelizeConfig.database);

  //Load models

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      !file.includes(".test.")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

//Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log(Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

    // db.sequelize.sync({
    //     force:true
    // })

export default db;

import { Sequelize } from 'sequelize';
import type { Env } from './env.config';
import { env } from './env.config';

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: "mysql";
};

export const configs = {
  [env.NODE_ENV]: {
    username: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    host: env.DB.HOST,
    dialect: "mysql",
  }

} as Record<Env, DBConfig>;

export const sequelize = new Sequelize(env.DB.NAME, env.DB.USER, env.DB.PASSWORD, {
  host: env.DB.HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false
});

// const SQL_DATABASE = String(process.env.SQL_DATABASE);
// const SQL_NAME = String(process.env.SQL_NAME);
// const SQL_PASSWORD = String(process.env.SQL_PASSWORD);
// const SQL_HOST = String(process.env.SQL_HOST);

// type Env = 'development' | 'test' | 'production';
// const env = (process.env.NODE_ENV || 'development') as Env;
// One to Many
// db.user.hasMany(db.post, { foreignKey: "user_id", as: "postDetails" });
// db.post.belongsTo(db.user, { foreignKey: "user_id", as: "UserInfo" });

// One To Many
// db.user.hasMany(db.comment, {
//   foreignKey: { name: "user_id", allowNull: true },
// });
// db.comment.belongsTo(db.user, {
//   foreignKey: { name: "user_id", allowNull: true },
// });

// One To Many
// db.post.hasMany(db.comment,{foreignKey  : "post_id"   });
// db.comment.belongsTo(db.post,{foreignKey  : "post_id"})

// export default db;

import { Sequelize } from 'sequelize';
// import usermodel from '../models/user';
// import postmodel from '../models/post';
// import commentmodel from '../models/comment';
// import tokenModel from '../modules/auth/token';
import db from '../models';

const SQL_DATABASE = String(process.env.SQL_DATABASE);
const SQL_NAME = String(process.env.SQL_NAME);
const SQL_PASSWORD = String(process.env.SQL_PASSWORD);
const SQL_HOST = String(process.env.SQL_HOST);



const sequelize = new Sequelize(SQL_DATABASE, SQL_NAME, SQL_PASSWORD, {
    host: SQL_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error: unknown) {
    console.error('Unable to connect to the database:', error);
  }
})();





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


    // db.sequelize.sync({
    //     force:true
    // })

export default db;
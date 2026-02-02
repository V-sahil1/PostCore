import { Sequelize } from 'sequelize';
import usermodel from '../modules/user/user';
import postmodel from '../modules/post/post';
import commentmodel from '../modules/comment/comment';
import tokenModel from '../modules/auth/token';

const SQL_DATABASE = String(process.env.SQL_DATABASE);
const SQL_NAME = String(process.env.SQL_NAME);
  const SQL_PASSWORD = String(process.env.SQL_PASSWORD);


const sequelize = new Sequelize(SQL_DATABASE, SQL_NAME, SQL_PASSWORD, {
    host: 'localhost',
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


type UserModel = ReturnType<typeof usermodel>;
type PostModel = ReturnType<typeof postmodel>;
type CommentModel = ReturnType<typeof commentmodel>;
type TokenModel = ReturnType<typeof tokenModel>;

type Db = {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  user: UserModel;
  post: PostModel;
  comment: CommentModel;
  token: TokenModel;
};

const db: Db = {} as Db;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = usermodel(sequelize)
db.post = postmodel(sequelize)
db.comment = commentmodel(sequelize)
db.token = tokenModel(sequelize)




// One to Many
db.user.hasMany(db.post, { foreignKey: "user_id", as: "postDetails" });
db.post.belongsTo(db.user, { foreignKey: "user_id", as: "UserInfo" });

// One To Many
db.user.hasMany(db.comment, {
  foreignKey: { name: "user_id", allowNull: true },
});
db.comment.belongsTo(db.user, {
  foreignKey: { name: "user_id", allowNull: true },
});

// One To Many
db.post.hasMany(db.comment,{foreignKey  : "post_id"   });
db.comment.belongsTo(db.post,{foreignKey  : "post_id"})


    // db.sequelize.sync({
    //     alter:true
    // })

export default db;
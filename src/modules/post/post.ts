import { DataTypes, type Sequelize } from "sequelize";

const PostModel = (sequelize: Sequelize) => {
  const user = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
      },
      user_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: "users",
    key: "id",
  },
  },
 

     
    },
    {}
  );

  return user;
};

export default PostModel;

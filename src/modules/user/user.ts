import { DataTypes, type Sequelize } from "sequelize";

const UserModel = (sequelize: Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user"
      },
     

    },
    {}
  );

  return user;
};

export default UserModel;

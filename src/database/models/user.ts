import {
  DataTypes,
  type Sequelize,
  Model,
  type ModelStatic,
  type Optional,
} from "sequelize";
import { USER_ROLES, type UserRole } from "../../const/user-role";

export interface UserAttributes {
  id?: number;
  user_name: string;
  email: string;
  password: string;
  role: UserRole;
  age: number;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "age">;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare user_name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare age: number;

  static associate(models: Record<string, ModelStatic<Model>>) {
    if (models.post) {
      User.hasMany(models.post, {
        foreignKey: "user_id",
        as: "postDetails",
      });
    }

    if (models.comment) {
      User.hasMany(models.comment, {
        foreignKey: { name: "user_id", allowNull: true },
      });
    }
  }
}

/**
 * 🔹 Model Init Function
 */
const UserModel = (sequelize: Sequelize): ModelStatic<User> => {
  User.init(
    {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(USER_ROLES)),
        allowNull: false,
        defaultValue: USER_ROLES.USER,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "user",
      underscored: true,
    }
  );

  return User;
};

export default UserModel;

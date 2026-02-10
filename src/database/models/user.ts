import { DataTypes, type Sequelize, Model, ModelStatic } from "sequelize";
import{ USER_ROLES, type UserRole} from "../../const/user-role";

type ModelWithAssociate = ModelStatic<Model> & {
  associate: (models: Record<string, ModelStatic<Model>>) => void;
};

const UserModel = (sequelize: Sequelize): ModelWithAssociate => {
  class User extends Model {
    declare user_name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare age: number;

    // Add static associate method with null check
    static associate(models: Record<string, ModelStatic<Model>>) {
      if (models.post) {
        User.hasMany(models.post, {
          foreignKey: "user_id",
          as: "postDetails"
        });
      }

      if (models.comment) {
        User.hasMany(models.comment, {
          foreignKey: { name: "user_id", allowNull: true },
        });
      }

    }
  }

  User.init(
    {
      user_name: {
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
        type: DataTypes.ENUM(...Object.values(USER_ROLES)),
        allowNull: false,
        defaultValue: "user"
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "users",
      modelName: "user"
    }
  );

  return User as ModelWithAssociate;
};

export default UserModel;
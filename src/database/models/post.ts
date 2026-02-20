import {
  DataTypes,
  Model,
  type Sequelize,
  type Optional,
  type ModelStatic,
} from "sequelize";

export interface PostAttributes {
  id: number;
  title: string;
  user_id: number;
}

type PostCreationAttributes = Optional<PostAttributes, "id">;

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  declare id: number;
  declare title: string;
  declare user_id: number;

  static associate(models: Record<string, ModelStatic<Model>>) {
    if (models.user) {
      Post.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "UserInfo",
      });
    }

    if (models.comment) {
      Post.hasMany(models.comment, {
        foreignKey: "post_id",
      });
    }
  }
}

const PostModel = (sequelize: Sequelize): ModelStatic<Post> => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
    {
      sequelize,
      underscored: true,
      tableName: "posts",
      modelName: "post",
    }
  );

  return Post;
};

export default PostModel;

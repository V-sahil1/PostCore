import { DataTypes, Model, ModelStatic, type Sequelize } from "sequelize";

type ModelWithAssociate = ModelStatic<Model> & {
  associate: (models: Record<string, ModelStatic<Model>>) => void
};
const PostModel = (sequelize: Sequelize): ModelWithAssociate => {
  class Post extends Model {
    declare title: string;
    declare user_id: number;
    // Add static associate method with null check
    static associate(models: Record<string, ModelStatic<Model>>) {
      if (models.user) {

        Post.belongsTo(models.user, { foreignKey: "user_id", as: "UserInfo" });
      }
      if (models.comment) {
        Post.hasMany(models.comment, { foreignKey: "post_id" });
      }
    }
  }
  Post.init(
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
    {

      sequelize,
      underscored: true,
      tableName: "posts",
      modelName: "post"

    }
  );

  return Post as ModelWithAssociate;
};

export default PostModel;

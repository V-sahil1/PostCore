import type { Optional } from "sequelize";
import { DataTypes, Model, type Sequelize, type ModelStatic } from "sequelize";

export interface CommentAttributes {
  id: number;
  description: string;
  is_guest: boolean;
  user_id?: number;
  post_id?: number;
}

export type CommentCreationAttributes = Optional<CommentAttributes, "id">;

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes {
  declare id: number;
  declare description: string;
  declare is_guest: boolean;
  declare user_id?: number;
  declare post_id?: number;

  static associate(models: Record<string, ModelStatic<Model>>) {
    if (models.user) {
      Comment.belongsTo(models.user, {
        foreignKey: { name: "user_id", allowNull: true },
      });
    }

    if (models.post) {
      Comment.belongsTo(models.post, { foreignKey: "post_id" });
    }
  }
}

const CommentModel = (sequelize: Sequelize): typeof Comment => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_guest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "posts",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "comments",
      underscored: true,
      modelName: "comment",
    }
  );

  return Comment;
};

export default CommentModel;

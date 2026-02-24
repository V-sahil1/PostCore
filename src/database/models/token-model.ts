import type { Optional } from "sequelize";
import { DataTypes, Model, type Sequelize } from "sequelize";

export interface TokenAttributes {
  id: number;
  token_value: string;
}

export type TokenCreationAttributes = Optional<TokenAttributes, "id">;

export class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes {
  declare id: number;
  declare token_value: string;
}

const TokenModel = (sequelize: Sequelize): typeof Token => {
  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "tokens",
      underscored: true,
      modelName: "token",
    }
  );

  return Token;
};

export default TokenModel;

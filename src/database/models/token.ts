import { type Sequelize, DataTypes } from "sequelize";
const tokenModel = (sequelize: Sequelize) => {
    const comment = sequelize.define('token', {
        token_value: {
            type: DataTypes.STRING
        },

    }, {
        underscored: true
    })
    return comment;

}

export default tokenModel
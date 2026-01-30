import { type Sequelize,DataTypes } from "sequelize";
const tokenModel = (sequelize:Sequelize)=>{
    const comment = sequelize.define('token',{
        TokenValue:{
            type :DataTypes.STRING
        },
    


    })
    return comment;

}

export default tokenModel
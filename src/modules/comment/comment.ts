import { type Sequelize,DataTypes } from "sequelize";
const commentModel = (sequelize:Sequelize)=>{
    const comment = sequelize.define('comment',{
        description:{
            type :DataTypes.STRING
        },
        is_guest:{
            type :DataTypes.BOOLEAN

        }
        


    },{
        underscored:true
    })
    return comment;

}

export default commentModel
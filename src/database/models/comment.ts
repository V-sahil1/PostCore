import { DataTypes, Model, ModelStatic, type Sequelize } from "sequelize";
type ModelWithAssociate = ModelStatic<Model> & {
  associate : (models:Record<string,ModelStatic<Model>>)=> void
};


const commentModel = (sequelize: Sequelize): ModelWithAssociate =>{
    class Comment extends Model{
        declare desciption : string;
        declare is_guest:boolean

         static associate(models: Record<string, ModelStatic<Model>>) {
      if (models.user) {

        Comment.belongsTo(models.user, {
  foreignKey: { name: "user_id", allowNull: true },
});
      }
      if (models.post) {
       Comment.belongsTo(models.post,{foreignKey  : "post_id"})
      }
    }
    }
    Comment.init(
        {
        description:{
            type :DataTypes.STRING
        },
        is_guest:{
            type :DataTypes.BOOLEAN

        }
        


    },
    {
       sequelize,
      underscored: true,
      tableName: "comments",
      modelName: "comment"
    })
    return Comment as ModelWithAssociate ;

}

export default commentModel
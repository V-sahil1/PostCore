import db from "../config/sql";
import type { Request, Response } from "express";
const Post = db.post;
const User = db.user;
const Comment = db.comment

type AuthUser = { id: number; role?: string; email?: string };
type IdRow = { id: number };
type CommentRow = { user_id: number };
type PostRow = { user_id: number };

function getAuthUser(req: Request): AuthUser | undefined {
    return req.user as unknown as AuthUser | undefined;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Internal Server Error";
}
export const getpost = async (req: Request, res: Response): Promise<Response> => {
    const data = await Post.findAll({
        attributes: ['title'],
        include: [
            {
                model: User,
                as: "UserInfo",
                attributes: ["user_name", "email"]
            },
            {
                model: Comment,


            },



        ],

    })
    return res.status(200).json(data);


}

export const getcomment = async (req: Request, res: Response): Promise<Response> => {
    const data = await Comment.findAll({
        // attributes: ['description'],
        // where: {
        //     id: 2
        // },
        // include: [
        //     {
        //         model: Post,
        //         // 👈 alias required
        //         attributes: ["title"],
        //     },
        //     {
        //         model: User,
        //         // 👈 alias required
        //         attributes: ["user_name"],
        //     },
        // ],

    })
    return res.status(200).json(data);
}
export const deletecomment = async (req: Request, res: Response): Promise<Response> => {


    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = Number(req.params.delId);
        const AuthComment =await Comment.findByPk(id);

        if(!AuthComment){
            return res.status(500).json({message:"Comment is not Found"})
        }
        const authCommentRow = AuthComment as unknown as CommentRow;
        if(authCommentRow.user_id !== user.id && user.role !== "admin"){
             return res.status(500).json({message:"You are Not authorized to delete the Comment"})
        }
        const data = await AuthComment.destroy();

        return res.status(200).json(data)    
    } catch (error: unknown) {
        return res.status(500).json({message:errorMessage(error)

        })   
    }
}
export const UpdateComment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // console.log(User)
        const id = Number(req.params.commentId);
        // console.log(id);
        const {description} = req.body;
        if(!description){
            return res.status(500).json({message:"Comment is requied"})
        }
        const existingComment = await Comment.findByPk( id);
        if(!existingComment){
            return res.status(500).json({message:'Comment is not Found'});
        }
        const existingCommentRow = existingComment as unknown as CommentRow;
        if(existingCommentRow.user_id !== user.id && user.role !== "admin"){
            return res.status(500).json({message:'You are Not authorized to update the Comment'});

        }
        const data = await existingComment.update({
            description,
          
        });
        return res.status(200).json(data
        )   
    } catch (error: unknown) {
         return res.status(500).json({message:errorMessage(error)});  
    }
}



export const postDelete = async (req: Request, res: Response): Promise<Response> => {


    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = Number(req.params.delId);
       const AuthComment =await Post.findByPk(id);
       if(!AuthComment){
            return res.status(500).json({message:"Comment is not Found"})
        }
        const authPostRow = AuthComment as unknown as PostRow;
        // && User.role !== "admin"
        if(authPostRow.user_id !== user.id  ){
             return res.status(500).json({message:"You are Not authorized to delete the Comment"})
        }
        const comment= await Comment.findAll({
            where:{
                post_id:id
            }
        })
       const arr = comment.map((item : number) => (item as unknown as IdRow).id);
        await Comment.destroy({
            where:{
                id:arr
            }
        })
        // console.log(comment)
           await AuthComment.destroy();
           return res.status(200).json({message:"Post is Deleted"})
         } catch (error: unknown) {
        return res.status(500).json({message:errorMessage(error)})  
    }


}


export const updatePost = async(req:Request,res:Response):Promise<Response>=>{
    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // console.log(User)
        const id = Number(req.params.upId);
        // console.log(id);
        const {title} = req.body;
        if(!title){
            return res.status(500).json({message:"Comment is requied"})
        }
        const existingPost = await Post.findByPk( id);
        if(!existingPost){
            return res.status(500).json({message:'Comment is not Found'});

        }
        const existingPostRow = existingPost as unknown as PostRow;

        // console.log(existingPost.user_id);
        // console.log(User.id );
        
        
        if(existingPostRow.user_id!==user.id && user.role !== "admin"){
            return res.status(500).json({message:'You are Not authorized to update the Comment'});

        }
        const data = await existingPost.update({
            title,
          
        });
        return res.status(200).json(data
        )   
    } catch (error: unknown) {
         return res.status(500).json({message:errorMessage(error)});  
    }






}
export const userDelete = async(req:Request,res:Response):Promise<Response>=>{
    try {
        const main = getAuthUser(req);
        if (!main) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = Number(req.params.userId)
        const comment =await Comment.findAll({
            where:{
                user_id:id
            }
        })
        
        const arr = comment.map((item:number) => (item as unknown as IdRow).id);
        await Comment.destroy({
            where:{
                id:arr
            }
        });

        const post = await Post.findAll({
            where:{
                user_id:id
            }
        })
        const arr1 = post.map((item:number) => (item as unknown as IdRow).id);
        await Post.destroy({
            where:{
                id:arr1
            }
        });

        

        const findUser =await User.findByPk(id)
        if(!findUser){
            return res.status(500).json({message:"User not found"})
        }
        const findUserRow = findUser as unknown as IdRow;

        if(main.id !== findUserRow.id && main.role !== "admin"){
            return res.status(500).json({message:"You are not allow to Delete User"})
        }
        await User.destroy({
          where:{
                id:id
            }
        })       
         return res.status(200).json({message :"User Deleted"})       
    } catch (error: unknown) {
         return res.status(500).json({message:errorMessage(error)});  
    }
}


export const getpostById = async (req: Request, res: Response): Promise<Response> => {
    try {
         const id = Number(req.params.pid);
           console.log(id);
    const data = await Post.findByPk(id)
    console.log(data);
    

    if(!data){
        return res.status(404).json({message:"Post is Not Found"});

    }
    return res.status(200).json(data);
        
    } catch (error: unknown) {
         return res.status(500).json({message:errorMessage(error)});  
    }
   


}





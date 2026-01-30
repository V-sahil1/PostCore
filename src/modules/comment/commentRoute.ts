  import db from "../../config/sql";

  import type { Request,Response } from "express";

  const Comment = db.comment;
  type AuthUser = { id: number; role?: string; email?: string };
  export const comment = async(req:Request,res:Response):Promise<Response>=>{

        try {
      const user = req.user as unknown as AuthUser | undefined;
      // console.log(req)

      // if (!user ) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

      // const post = req.post as any;

      // if (!post) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

      const { description} = req.body;
      const { postId } = req.params;

      if (!description) {
        return res.status(400).json({ message: "description is required" });
      }

      const comment = await Comment.create({
        description,
      //   postId:post.id,
       user_id: user ? user.id : null, // ✅ guest allowed
      is_guest: !user,
        post_id:Number(postId)
      });
      return res.status(201).json({
        message: "comment created successfully",
        comment,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return res.status(500).json({
        message,
      });
    }
  };



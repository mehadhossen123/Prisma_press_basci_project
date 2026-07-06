import { Router } from "express";
import { commentController } from "./comment.controller";
import { profileAuth } from "../user/user.route";

const router=Router()
router.get("/author/:authorId",commentController.getCommentByAuthorId)
router.post("/",profileAuth(),commentController.postComment)

router.get("/:commentId",commentController.getCommentById)
router.patch("/:commentId",profileAuth(),commentController.updateComment)
router.delete("/:commentId",profileAuth(),commentController.deleteComment)
router.put("/:comment/moderates",commentController.moderateComment)



export const  commentRouter=router
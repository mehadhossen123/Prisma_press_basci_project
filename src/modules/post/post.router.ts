import { Router } from "express";
import { postController } from "./post.controller";
import { profileAuth } from "../user/user.route";

const router=Router();
router.post("/",profileAuth(),postController.createPost)
router.get("/",postController.getAllPost)

router.get("/stats",postController.getPostStats)
router.get("/my-post",profileAuth(),postController.getMyPost)
router.get("/:postId",postController.getPostById)
router.patch("/:postId",profileAuth(),postController.updatePost)
router.delete("/:postId",profileAuth(),postController.deletePost)



export const postRouter=router;
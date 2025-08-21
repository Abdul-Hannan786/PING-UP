import express from "express";
import { upload } from "../configs/multer.js";
import { addPost, getFeedPosts, likePost } from "../controller/postController.js";

const router = express.Router();

router.post("/add", upload.array("images", 4), addPost);
router.get("/feed", getFeedPosts)
router.post("/like", likePost)

export default router;

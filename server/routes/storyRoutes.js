import express from "express";
import { upload } from "../configs/multer.js";
import { addUserStory, getStories } from "../controller/storyController.js";

const router = express.Router();

router.post("/create", upload.single("media"), addUserStory);
router.get("/get", getStories);

export default router;

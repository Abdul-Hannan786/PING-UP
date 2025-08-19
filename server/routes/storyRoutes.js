import express from "express";
import { upload } from "../configs/multer.js";
import { addUserStory } from "../controller/storyController.js";
import { getStories } from "../controller/storyCOntroller";

const router = express.Router();

router.post("/create", upload.single("media"), addUserStory);
router.get("/get", getStories);

export default router;

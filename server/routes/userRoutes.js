import express from "express";
import { discoverUsers, followUser, getUserData, unfollowUser, updateUserData } from "../controller/userController.js";
import { upload } from "../configs/multer.js";

const router = express.Router();

router.get("/data", getUserData);
router.post("/update", upload.fields([{ name: "profile", maxCount: 1 }, { name: "cover", maxCount: 1 },]), updateUserData);
router.post("/discover", discoverUsers)
router.post("/follow", followUser)
router.post("/unfollow", unfollowUser)


export default router;

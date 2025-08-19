import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Story from "../models/Story.js";
import User from "../models/User.js";

// Function to add user story
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    // Upload media to imagekit
    if (media_type === "image" || media_type === "video") {
      const fileBuffer = media.buffer;
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }

    // Create Story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    // Schedule story deletion after 24 hours
    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Function to get user stories
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    // User connections and followings
    const userIds = [userId, ...user.connections, ...user.following];
    const stories = await Story.find({
      user: { $in: userIds },
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

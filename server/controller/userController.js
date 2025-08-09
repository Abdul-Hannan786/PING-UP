import User from "../models/User.js";

// Get User data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update the user
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { username, bio, location, full_name } = req.body;
    const profile = req.files.profile || req.files.profile[0];
    const cover = req.files.cover || req.files.cover[0];
    const tempUser = await User.findById(userId);

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        res.json({ success: false, message: "username already taken" });
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

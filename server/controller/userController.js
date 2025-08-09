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
// export const updateUserData = async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const { username, bio, location, full_name } = req.body;
//     const tempUser = await User.findById(userId);

    
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

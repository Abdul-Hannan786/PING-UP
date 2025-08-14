export const protect = async (req, res, next) => {
  try {
    const {userId} = req.auth();
    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

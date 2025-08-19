import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import { protect } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", protect, userRouter);
app.use("/api/post", protect, postRouter);
app.use("/api/story", protect, storyRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

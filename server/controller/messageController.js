import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";

// Create an empty object to store Servser Side event connections
const connections = {};

// Contoller function for the SSE(Servser Side Event) endpoint
export const sseController = (req, res) => {
  const { userId } = req.params;
  console.log("New client connected", userId);

  // Set SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Add the client's response object to the connections object
  connections[userId] = res;

  // Send an initial event to the client
  res.write("log: Connected to SSE stream\n\n");

  // Handle client disconnection
  res.on("close", () => {
    // Remove the client's response object from the connections array
    delete connections[userId];
    console.log("Client disconnected");
  });
};

// Function to send message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      const fileBuffer = image.buffer;
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalName,
      });

      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    res.json({ success: true, message });

    // Send message to to_user_id using SSE
    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id"
    );

    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

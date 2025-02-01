import { OAuth2Client } from "google-auth-library";
import { wss } from "../ws/websocket.js";
import { WebSocket } from "ws";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth Middleware
const googleAuth = async (req, res, next) => {
  const { token } = req.body;
  const user = req.body.user;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, picture } = payload;

    if (wss && wss.clients && user.userID) {
      const ws = [...wss.clients].find(
        (c) => c.userID?.toString() === user.userID?.toString()
      );

      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "update_user",
              updatedNickname: name,
              updatedProfilePicture: picture,
            })
          );
        }
      }
    }

    req.userID = user.userID;
    req.user = payload; // Attach the user to the request object for use in the route
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).json({ error: "Invalid token" });
  }
};

export { googleAuth };

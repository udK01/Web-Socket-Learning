import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth Middleware
const googleAuth = (users) => async (req, res, next) => {
  const { token, userID } = req.body;

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

    // Update user info with nickname and profile picture
    if (users[userID]) {
      users[userID].nickname = name;
      users[userID].profilePicture = picture;
    }

    req.user = payload; // Attach the user to the request object for use in the route
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).json({ error: "Invalid token" });
  }
};

export { googleAuth };

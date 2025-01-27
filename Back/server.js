import connectDB from "./config/db.js";

import session from "express-session";
import passport from "passport";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import initializeWebSocket from "./ws/websocket.js";
import { profileUpload } from "./routes/upload.js";
import { googleAuth } from "./routes/googleAuth.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB();

let users = {};
let groups = [];

// Google Auth
app.post("/api/auth/google", googleAuth(users), (req, res) => {
  const { userID } = req.body;
  const user = req.user; // Get user from the request object

  // Respond with the user information if login is successful
  if (userID) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(400).json({ error: "User ID is missing" });
  }
});

// Express Route for File Upload
app.post("/upload", profileUpload, (req, res) => {
  const userID = req.body.userID;

  if (!req.file || !userID) {
    return res.status(400).json({ message: "File or userID is missing" });
  }

  res.status(200).json(req.file.filename);

  users[userID].profilePicture = req.file.filename;
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

initializeWebSocket(users, groups);

// wss.on("connection", (ws) => {
//   const userID = uuidv4();
//   const nickname = "Anonymous";
//   const profilePicture = "base.png";

//   console.log(`New client connected with ID: ${userID}`);

//   users[userID] = { nickname, profilePicture };

//   // Initialise User & Chat Logs.
//   ws.send(JSON.stringify({ type: "history", messages }));
//   ws.send(JSON.stringify({ type: "user", userID, nickname, profilePicture }));

//   ws.on("message", (data) => {
//     const parsedData = JSON.parse(data);

//     switch (parsedData.type) {
//       case "message":
//         handleMessages(userID, parsedData);
//         break;
//       case "update_user":
//         handleUserUpdated(userID, parsedData);
//         break;
//       case "reply":
//         handleReply(userID, parsedData);
//         break;
//       case "edit":
//         handleEdit(parsedData);
//         break;
//       case "delete":
//         handleDelete(parsedData);
//         break;
//     }
//   });

//   ws.on("close", () => {
//     console.log(`Client with ID ${userID} has disconnected.`);

//     if (users[userID].profilePicture !== "base.png") {
//       const imagePath = `../Front/public/${users[userID].profilePicture}`;
//       fs.unlink(imagePath, (err) => {
//         if (err) {
//           console.error(`Error deleting image: ${imagePath}`, err);
//         } else {
//           console.log(`Image deleted successfully: ${imagePath}`);
//         }
//       });
//     }

//     delete users[userID];
//   });
// });

// function handleMessages(userID, parsedData) {
//   // Destructure Data Received.
//   const fullMessage = {
//     messageID: uuidv4(),
//     userID: userID,
//     nickname: users[userID].nickname,
//     profilePicture: users[userID].profilePicture,
//     parent: null,
//     message: parsedData.message,
//   };

//   logMessage(fullMessage);
// }

// function handleReply(userID, parsedData) {
//   // Destructure Data Received.
//   const fullMessage = {
//     userID: userID,
//     nickname: users[userID].nickname,
//     profilePicture: users[userID].profilePicture,
//     parent: parsedData.reply,
//     message: parsedData.message,
//   };

//   logMessage(fullMessage);
// }

// function handleUserUpdated(userID, parsedData) {
//   // Destructure Data Received.
//   const {
//     updatedNickname: updatedNickname,
//     updatedProfilePicture: updatedProfilePicture,
//   } = parsedData;

//   // Alter User.
//   if (users[userID]) {
//     users[userID].nickname = updatedNickname;
//     users[userID].profilePicture = updatedProfilePicture;
//   }

//   // Alter Log.
//   messages.forEach((msg) => {
//     if (msg.parent && msg.parent.userID === userID) {
//       msg.parent.nickname = updatedNickname;
//     }
//     if (msg.userID === userID) {
//       msg.nickname = updatedNickname;
//     }
//   });

//   updateHistory();
// }

// function handleDelete(parsedData) {
//   messages = messages.filter(
//     (msg) => msg.messageID !== parsedData.selectedMessage.messageID
//   );

//   updateHistory();
// }

// function handleEdit(parsedData) {
//   const messageID = parsedData.edit.messageID;
//   const newMessage = parsedData.message;

//   messages.forEach((msg) => {
//     if (msg.messageID === messageID) {
//       msg.message = newMessage;
//     }
//   });

//   updateHistory();
// }

// function logMessage(fullMessage) {
//   // Add To Log.
//   messages.push(fullMessage);

//   // Send Full Message To The Front.
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ type: "message", data: fullMessage }));
//     }
//   });
// }

// function updateHistory() {
//   console.log(messages);
//   // Update Other User's Logs.
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "history",
//           messages,
//         })
//       );
//     }
//   });
// }

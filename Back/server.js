const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Front/public/");
  },
  filename: (req, file, cb) => {
    const currentTimeInMillis = Date.now();
    const uniqueName = `${currentTimeInMillis}${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const app = express();
const PORT = 3000;

app.use(cors());

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];
let users = {};

// Express Route for File Upload
app.post("/upload", upload.single("file"), (req, res) => {
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

wss.on("connection", (ws) => {
  const userID = uuidv4();
  const nickname = "Anonymous";
  const profilePicture = "base.png";

  console.log(`New client connected with ID: ${userID}`);

  users[userID] = { nickname, profilePicture };

  // Initialise User & Chat Logs.
  ws.send(JSON.stringify({ type: "history", messages }));
  ws.send(JSON.stringify({ type: "user", userID, nickname, profilePicture }));

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === "message") {
      handleMessages(userID, parsedData);
    } else if (parsedData.type === "update_user") {
      handleUserUpdated(userID, parsedData);
    } else if (parsedData.type === "reply") {
      handleReply(userID, parsedData);
    }
  });

  ws.on("close", () => {
    console.log(`Client with ID ${userID} has disconnected.`);

    if (users[userID].profilePicture !== "base.png") {
      const imagePath = `../Front/public/${users[userID].profilePicture}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image: ${imagePath}`, err);
        } else {
          console.log(`Image deleted successfully: ${imagePath}`);
        }
      });
    }

    delete users[userID];
  });
});

function handleMessages(userID, parsedData) {
  // Destructure Data Received.
  const fullMessage = {
    userID: userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: null,
    message: parsedData.message,
  };

  logMessage(fullMessage);
}

function handleReply(userID, parsedData) {
  // Destructure Data Received.
  const fullMessage = {
    userID: userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: parsedData.reply,
    message: parsedData.message,
  };

  logMessage(fullMessage);
}

function handleUserUpdated(userID, parsedData) {
  // Destructure Data Received.
  const {
    updatedNickname: updatedNickname,
    updatedProfilePicture: updatedProfilePicture,
  } = parsedData;

  // Alter User.
  if (users[userID]) {
    users[userID].nickname = updatedNickname;
    users[userID].profilePicture = updatedProfilePicture;
  }

  // Alter Log.
  messages.forEach((msg) => {
    if (msg.userID === userID) {
      msg.nickname = updatedNickname;
    }
  });

  // Update Other User's Logs.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "history",
          messages,
        })
      );
    }
  });
}

function logMessage(fullMessage) {
  // Add To Log.
  messages.push(fullMessage);

  // Send Full Message To The Front.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "message", data: fullMessage }));
    }
  });
}

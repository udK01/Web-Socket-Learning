const WebSocket = require("ws");
const { v4: uuidv4, parse } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];
let users = {};

wss.on("connection", (ws) => {
  const userID = uuidv4();
  const nickname = "Anonymous";
  const profilePicture = "logo.png";

  console.log(`New client connected with ID: ${userID}`);

  users[userID] = { nickname, profilePicture };

  ws.send(JSON.stringify({ type: "history", messages }));
  ws.send(JSON.stringify({ type: "user", nickname, profilePicture }));

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === "message") {
      const fullMessage = {
        userID: userID,
        nickname: users[userID].nickname,
        message: parsedData.message,
      };
      messages.push(fullMessage);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", data: fullMessage }));
        }
      });
    } else if (parsedData.type === "update_user") {
      const {
        updatedNickname: updatedNickname,
        updatedProfilePicture: updatedProfilePicture,
      } = parsedData;

      if (users[userID]) {
        users[userID].nickname = updatedNickname;
        users[userID].profilePicture = updatedProfilePicture;
      }

      messages.forEach((msg) => {
        if (msg.userID === userID) {
          msg.nickname = updatedNickname;
        }
      });

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
  });

  ws.on("close", () => {
    console.log(`Client with ID ${userID} has disconnected.`);
    delete users[userID];
  });
});

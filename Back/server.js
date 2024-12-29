const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];

wss.on("connection", (ws) => {
  const userID = uuidv4();
  const profilePicture = "logo.png";
  console.log(`New client connected with ID: ${userID}`);

  ws.send(JSON.stringify({ type: "history", messages }));
  ws.send(JSON.stringify({ type: "user", userID, profilePicture }));

  ws.on("message", (data) => {
    const message = data.toString();
    const messageWithUserID = { userID, message };
    messages.push(messageWithUserID);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "message", data: messageWithUserID })
        );
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client with ID ${userID} has disconnected.`);
  });
});

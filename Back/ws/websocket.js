const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const {
  handleMessages,
  handleReply,
  handleUserUpdated,
  handleDelete,
  handleEdit,
  handleCreateGroup,
} = require("./handlers");

module.exports = (users, groups) => {
  const wss = new WebSocket.Server({ port: 8080 });
  let messages = [];

  wss.on("connection", (ws) => {
    const userID = uuidv4();
    const nickname = "Anonymous";
    const profilePicture = "base.png";

    console.log(`New client connected with ID: ${userID}`);

    users[userID] = { nickname, profilePicture };

    // Send initial data to the client
    ws.send(JSON.stringify({ type: "groups", groups }));
    ws.send(JSON.stringify({ type: "user", userID, nickname, profilePicture }));

    ws.on("message", (data) => {
      const parsedData = JSON.parse(data);

      switch (parsedData.type) {
        case "message":
          handleMessages(userID, parsedData, users, groups, wss);
          break;
        case "update_user":
          handleUserUpdated(userID, parsedData, users, messages, wss);
          break;
        case "reply":
          handleReply(userID, parsedData, users, groups, wss);
          break;
        case "edit":
          handleEdit(parsedData, groups, wss);
          break;
        case "delete":
          handleDelete(parsedData, groups, wss);
          break;
        case "create_group":
          handleCreateGroup(userID, parsedData, groups, wss);
          break;
      }
    });

    ws.on("close", () => {
      console.log(`Client with ID ${userID} has disconnected.`);

      // if (users[userID]?.profilePicture !== "base.png") {
      //   const imagePath = `../Front/public/${users[userID].profilePicture}`;
      //   require("fs").unlink(imagePath, (err) => {
      //     if (err) {
      //       console.error(`Error deleting image: ${imagePath}`, err);
      //     } else {
      //       console.log(`Image deleted successfully: ${imagePath}`);
      //     }
      //   });
      // }

      delete users[userID];
    });
  });

  console.log("WebSocket server running on ws://localhost:8080");
};

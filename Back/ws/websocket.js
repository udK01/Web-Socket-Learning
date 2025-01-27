import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import {
  handleMessages,
  handleReply,
  handleUserUpdated,
  handleDelete,
  handleEdit,
  handleCreateGroup,
  handleDeleteGroup,
  handleClearSelected,
} from "./handlers.js";

export default (users, groups) => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", (ws) => {
    const userID = uuidv4();
    const nickname = "Anonymous";
    const profilePicture = "base.png";

    console.log(`New client connected with ID: ${userID}`);

    users[userID] = { nickname, profilePicture };

    ws.send(JSON.stringify({ type: "groups", groups }));
    ws.send(JSON.stringify({ type: "user", userID, nickname, profilePicture }));

    ws.on("message", (data) => {
      const parsedData = JSON.parse(data);

      switch (parsedData.type) {
        case "message":
          handleMessages(userID, parsedData, users, groups, wss);
          break;
        case "update_user":
          handleUserUpdated(userID, parsedData, users, groups, wss);
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
        case "delete_group":
          handleDeleteGroup(parsedData, groups, wss);
          break;
        case "clear_selected":
          handleClearSelected(wss);
          break;
      }
    });

    ws.on("close", () => {
      console.log(`Client with ID ${userID} has disconnected.`);
      delete users[userID];
    });
  });

  console.log("WebSocket server running on ws://localhost:8080");
};

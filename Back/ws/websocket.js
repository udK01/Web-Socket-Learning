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
  initialiseGroups,
  addNewUser,
} from "./handlers.js";

export default async (users) => {
  const wss = new WebSocketServer({ port: 8080 });
  let groups = await initialiseGroups();

  wss.on("connection", async (ws) => {
    // const userID = uuidv4();
    // const nickname = "Anonymous";
    // const profilePicture = "base.png";

    // console.log(`New client connected with ID: ${userID}`);
    const user = await addNewUser();

    // users[userID] = { nickname, profilePicture }; // await addNewUser();
    users.push(user);

    ws.send(JSON.stringify({ type: "groups", groups }));
    // ws.send(JSON.stringify({ type: "user", userID, nickname, profilePicture }));
    ws.send(JSON.stringify({ type: "user", user }));

    ws.on("message", async (data) => {
      const parsedData = JSON.parse(data);

      switch (parsedData.type) {
        case "message":
          await handleMessages(userID, parsedData, users, groups, wss);
          break;
        case "update_user":
          handleUserUpdated(userID, parsedData, users, groups, wss);
          break;
        case "reply":
          await handleReply(userID, parsedData, users, groups, wss);
          break;
        case "edit":
          await handleEdit(parsedData, groups, wss);
          break;
        case "delete":
          await handleDelete(parsedData, groups, wss);
          break;
        case "create_group":
          await handleCreateGroup(userID, parsedData, groups, wss);
          break;
        case "delete_group":
          await handleDeleteGroup(parsedData, groups, wss);
          break;
        case "clear_selected":
          handleClearSelected(wss);
          break;
      }
    });

    // ws.on("close", () => {
    //   console.log(`Client with ID ${userID} has disconnected.`);
    //   delete users[userID];
    // });
  });

  console.log("WebSocket server running on ws://localhost:8080");
};

import { WebSocketServer } from "ws";
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
} from "./handlers.js";
import { getUserBySession } from "./userManager.js";

const wss = new WebSocketServer({ port: 8080 });

export let groups = [];

export default async (users) => {
  groups = await initialiseGroups();

  wss.on("connection", async (ws) => {
    let user;
    ws.on("message", async (data) => {
      const parsedData = JSON.parse(data);

      if (parsedData.type === "session") {
        user = await getUserBySession(parsedData.sessionID);

        if (!user) {
          user = await addNewUser(parsedData.sessionID);
        }

        users.push(user);

        ws.send(JSON.stringify({ type: "user", user }));
        ws.send(JSON.stringify({ type: "groups", groups }));
        ws.userID = user._id;
      }

      switch (parsedData.type) {
        case "message":
          await handleMessages(user, parsedData, groups, wss);
          break;
        case "update_user":
          handleUserUpdated(user, parsedData, groups, wss);
          break;
        case "reply":
          await handleReply(user, parsedData, groups, wss);
          break;
        case "edit":
          await handleEdit(parsedData, groups, wss);
          break;
        case "delete":
          await handleDelete(parsedData, groups, wss);
          break;
        case "create_group":
          await handleCreateGroup(user, parsedData, groups, wss);
          break;
        case "delete_group":
          await handleDeleteGroup(parsedData, groups, wss);
          break;
        case "clear_selected":
          handleClearSelected(wss);
          break;
      }
    });
  });

  console.log("WebSocket server running on ws://localhost:8080");
};

export { wss };

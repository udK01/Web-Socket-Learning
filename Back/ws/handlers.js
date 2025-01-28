import WebSocket from "ws";
import Message from "../models/message.js";
import Group from "../models/group.js";

export async function handleMessages(userID, parsedData, users, groups, wss) {
  const fullMessage = {
    groupID: parsedData.groupID,
    userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: null,
    message: parsedData.message,
  };

  try {
    const newMessage = new Message(fullMessage);
    const savedMessage = await newMessage.save();
    logMessage(savedMessage, groups, wss);
  } catch (error) {
    console.log("Error adding message:", error);
  }
}

export async function handleReply(userID, parsedData, users, groups, wss) {
  // Destructure Data Received.
  const fullMessage = {
    groupID: parsedData.groupID,
    userID: userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: parsedData.reply._id,
    message: parsedData.message,
  };

  try {
    const newMessage = new Message(fullMessage);
    const savedMessage = await newMessage.save();
    logMessage(savedMessage, groups, wss);
  } catch (error) {
    console.log("Error adding message:", error);
  }
}

export async function handleCreateGroup(userID, parsedData, groups, wss) {
  const group = {
    groupOwner: userID,
    groupName: parsedData.groupName,
    groupImg: "./vite.svg",
    messages: [],
  };

  try {
    const newGroup = new Group(group);
    const savedGroup = await newGroup.save();
    groups.push(savedGroup);
    updateGroups(groups, wss);
  } catch (error) {
    console.log("Error adding message:", error);
  }
}

export function handleDeleteGroup(parsedData, groups, wss) {
  const { groupID } = parsedData.group;

  groups.splice(
    0,
    groups.length,
    ...groups.filter((group) => group.groupID !== groupID)
  );

  updateGroups(groups, wss);
}

export function handleUserUpdated(userID, parsedData, users, groups, wss) {
  // Destructure Data Received.
  const {
    updatedNickname: updatedNickname,
    updatedProfilePicture: updatedProfilePicture,
    groupID: groupID,
  } = parsedData;

  // Alter User.
  if (users[userID]) {
    users[userID].nickname = updatedNickname;
    users[userID].profilePicture = updatedProfilePicture;
  }

  // Alter Parent Messages in Groups.
  groups.forEach((group) => {
    group.messages.forEach((msg) => {
      if (msg.parent && msg.parent.userID === userID) {
        msg.parent.nickname = updatedNickname;
        msg.parent.profilePicture = updatedProfilePicture;
      }
    });
  });

  // Alter Regular Messages in Groups.
  groups.forEach((group) => {
    group.messages.forEach((msg) => {
      if (msg.userID === userID) {
        msg.nickname = updatedNickname;
        msg.profilePicture = updatedProfilePicture;
      }
    });
  });

  updateGroups(groups, wss);

  updateHistory(
    groups.find((group) => group.groupID === groupID).messages,
    wss
  );
}

export function handleDelete(parsedData, groups, wss) {
  const { groupID, messageID } = parsedData.selectedMessage;
  const group = groups.find((group) => group.groupID === groupID);

  if (group) {
    const filteredMessages = group.messages.filter(
      (msg) => msg.messageID !== messageID
    );

    group.messages = [...filteredMessages];

    updateHistory(filteredMessages, wss);
  }
}

export function handleEdit(parsedData, groups, wss) {
  const { messageID, groupID } = parsedData.edit;
  const newMessage = parsedData.message;

  const group = groups.find((group) => group.groupID === groupID);

  if (group) {
    // Update the target message
    group.messages = group.messages.map((msg) =>
      msg.messageID === messageID ? { ...msg, message: newMessage } : msg
    );

    // Update any messages that reference the updated message as a parent
    group.messages = group.messages.map((msg) => {
      if (msg.parent && msg.parent.messageID === messageID) {
        return {
          ...msg,
          parent: {
            ...msg.parent,
            message: newMessage,
          },
        };
      }
      return msg;
    });

    // Push updated group messages to history
    updateHistory(group.messages, wss);
  }
}

export function handleClearSelected(wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "clear_selected",
        })
      );
    }
  });
}

export async function initialiseGroups() {
  try {
    const groups = await Group.find();

    await Promise.all(
      groups.map(async (group) => {
        const messages = await Message.find({ groupID: group._id });
        group.messages.push(...messages);
      })
    );

    return groups;
  } catch (err) {
    console.error("Error fetching groups:", err);
  }
}

function logMessage(fullMessage, groups, wss) {
  // Add To Log.
  groups
    .find((group) => group._id.toString() === fullMessage.groupID.toString())
    .messages.push(fullMessage);

  // Send Full Message To The Front.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "message", data: fullMessage }));
    }
  });
}

/**
 *
 * Updates the currently Selected Group.
 *
 * @param {String[]} messages
 * @param {Socket Server} wss
 */
function updateHistory(messages, wss) {
  // Update Other User's Logs.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "edited_messages",
          messages,
        })
      );
    }
  });
}

/**
 *
 * Updates all the Groups.
 *
 * @param {String[]} groups
 * @param {Socket Server} wss
 */
function updateGroups(groups, wss) {
  // Update Other User's Logs.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "groups",
          groups,
        })
      );
    }
  });
}

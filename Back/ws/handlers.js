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

export async function handleDeleteGroup(parsedData, groups, wss) {
  const { _id } = parsedData.group;

  try {
    await Group.findByIdAndDelete(_id);

    groups.splice(
      0,
      groups.length,
      ...groups.filter((group) => group._id.toString() !== _id.toString())
    );

    updateGroups(groups, wss);
  } catch (error) {
    console.log("Failed to delete group:", error);
  }
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

export async function handleDelete(parsedData, groups, wss) {
  const { groupID, _id } = parsedData.selectedMessage;
  const group = groups.find(
    (group) => group._id.toString() === groupID.toString()
  );

  try {
    if (group) {
      await Message.findByIdAndDelete(_id);

      const filteredMessages = group.messages.filter(
        (msg) => msg._id.toString() !== _id.toString()
      );

      group.messages = [...filteredMessages];

      updateHistory(filteredMessages, wss);
    }
  } catch (error) {
    console.log("Failed to delete message:", error);
  }
}

export async function handleEdit(parsedData, groups, wss) {
  const { _id, groupID } = parsedData.edit;
  const newMessage = parsedData.message;

  const group = groups.find(
    (group) => group._id.toString() === groupID.toString()
  );

  try {
    if (group) {
      await Message.findByIdAndUpdate(_id, { message: newMessage });

      group.messages.forEach((msg) => {
        if (msg._id.toString() === _id.toString()) {
          msg.message = newMessage;
        }
      });

      // Push updated group messages to history
      updateHistory(group.messages, wss);
    }
  } catch (error) {
    console.log("Failed to edit message:", error);
  }
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

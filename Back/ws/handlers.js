import WebSocket from "ws";
import Message from "../models/message.js";
import Group from "../models/group.js";
import User from "../models/user.js";

export async function handleMessages(user, parsedData, groups, wss) {
  const fullMessage = {
    groupID: parsedData.groupID,
    userID: user._id,
    nickname: user.nickname,
    profilePicture: user.profilePicture,
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

export async function handleReply(user, parsedData, groups, wss) {
  // Destructure Data Received.
  const fullMessage = {
    groupID: parsedData.groupID,
    userID: user._id,
    nickname: user.nickname,
    profilePicture: user.profilePicture,
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

export async function handleCreateGroup(user, parsedData, groups, wss) {
  const group = {
    groupOwner: user._id,
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
    // Delete Group From DB.
    await Group.findByIdAndDelete(_id);

    // Remove Related Messages From DB.
    await Message.deleteMany({ groupID: _id });

    // Remove Group From Array.
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

export async function handleUserUpdated(user, parsedData, groups, wss) {
  // Destructure Data
  const { updatedNickname, updatedProfilePicture, groupID } = parsedData;

  // Alter User.
  user.nickname = updatedNickname;
  user.profilePicture = updatedProfilePicture;

  try {
    await User.findByIdAndUpdate(user._id, {
      nickname: updatedNickname,
      profilePicture: updatedProfilePicture,
    });

    // Alter Parent Messages in Groups.
    groups.forEach((group) => {
      group.messages.forEach((msg) => {
        if (msg.parent && msg.parent._id.toString() === user._id.toString()) {
          msg.parent.nickname = updatedNickname;
          msg.parent.profilePicture = updatedProfilePicture;
        }
      });
    });

    // Alter Regular Messages in Groups.
    groups.forEach((group) => {
      group.messages.forEach((msg) => {
        if (msg.userID.toString() === user._id.toString()) {
          msg.nickname = updatedNickname;
          msg.profilePicture = updatedProfilePicture;
        }
      });
    });

    updateGroups(groups, wss);

    if (groupID !== null) {
      updateHistory(
        groups.find((group) => group._id.toString() === groupID).messages,
        wss
      );
    }
  } catch (error) {
    console.log("Failed to update user:", error);
  }
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
  const group = groups.find(
    (group) => group._id.toString() === fullMessage.groupID.toString()
  );

  group.messages.push(fullMessage);

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

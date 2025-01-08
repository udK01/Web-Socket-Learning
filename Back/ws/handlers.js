const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

function handleMessages(userID, parsedData, users, messages, wss) {
  const fullMessage = {
    messageID: uuidv4(),
    userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: null,
    message: parsedData.message,
  };

  messages.push(fullMessage);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "message", data: fullMessage }));
    }
  });
}

function handleReply(userID, parsedData, users, messages, wss) {
  // Destructure Data Received.
  const fullMessage = {
    messageID: uuidv4(),
    userID: userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: parsedData.reply,
    message: parsedData.message,
  };

  logMessage(fullMessage, messages, wss);
}

function handleCreateGroup(userID, parsedData, groups, wss) {
  const group = {
    groupID: uuidv4(),
    groupOwner: userID,
    groupName: parsedData.groupName,
    groupImg: "./vite.svg",
    messages: [],
  };

  groups.push(group);
  updateGroups(groups, wss);
}

function handleUserUpdated(userID, parsedData, users, messages, wss) {
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
    if (msg.parent && msg.parent.userID === userID) {
      msg.parent.nickname = updatedNickname;
    }
    if (msg.userID === userID) {
      msg.nickname = updatedNickname;
    }
  });

  updateHistory(messages, wss);
}

function handleDelete(parsedData, messages, wss) {
  const filteredMessages = messages.filter(
    (msg) => msg.messageID !== parsedData.selectedMessage.messageID
  );

  messages.length = 0;
  messages.push(...filteredMessages);

  updateHistory(filteredMessages, wss);
}

function handleEdit(parsedData, messages, wss) {
  const messageID = parsedData.edit.messageID;
  const newMessage = parsedData.message;

  messages.forEach((msg) => {
    if (msg.messageID === messageID) {
      msg.message = newMessage;
    }
  });

  updateHistory(messages, wss);
}

function logMessage(fullMessage, messages, wss) {
  // Add To Log.
  messages.push(fullMessage);

  // Send Full Message To The Front.
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "message", data: fullMessage }));
    }
  });
}

function updateHistory(messages, wss) {
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

module.exports = {
  handleMessages,
  handleReply,
  handleUserUpdated,
  handleDelete,
  handleEdit,
  handleCreateGroup,
};

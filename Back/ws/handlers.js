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
    userID: userID,
    nickname: users[userID].nickname,
    profilePicture: users[userID].profilePicture,
    parent: parsedData.reply,
    message: parsedData.message,
  };

  logMessage(fullMessage, messages, wss);
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
  messages = messages.filter(
    (msg) => msg.messageID !== parsedData.selectedMessage.messageID
  );

  updateHistory(messages, wss);
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

module.exports = {
  handleMessages,
  handleReply,
  handleUserUpdated,
  handleDelete,
  handleEdit,
};
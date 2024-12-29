const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];

wss.on("connection", (ws) => {
  console.log("New client connected!");

  ws.send(JSON.stringify(messages));

  ws.on("message", (data) => {
    const message = data.toString();
    messages.push(message);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client has disconnected.");
  });
});

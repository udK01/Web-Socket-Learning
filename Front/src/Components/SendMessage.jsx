import { useState } from "react";

import { useWebSocket } from "../WebSocketProvider";

export default function SendMessage({ reply, setReply }) {
  const [message, setMessage] = useState("");

  const { ws } = useWebSocket();

  // Message Handler
  const handleSendMessage = () => {
    if (message.trim() !== "" && ws) {
      if (!reply) {
        ws.send(
          JSON.stringify({
            type: "message",
            message,
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: "reply",
            reply,
            message,
          })
        );
        setReply(null);
      }
      setMessage("");
    }
  };

  return (
    <input
      className="w-full h-[10%] bg-transparent ring-1 rounded-md p-2 text-left align-top resize-none overflow-y-auto focus:outline-none text-white"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      placeholder="Type your message here..."
    />
  );
}

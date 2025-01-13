import { useEffect, useRef, useState } from "react";

import { useWebSocket } from "../Providers/WebSocketProvider";
import { useGroup } from "../Providers/GroupProvider";

export default function SendMessage({ reply, setReply, edit, setEdit }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const { ws } = useWebSocket();
  const { selectedGroup } = useGroup();

  // Automatically Select Input Field On Edit.
  useEffect(() => {
    if ((edit || reply) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edit, reply]);

  // Message Handler
  const handleSendMessage = () => {
    if (message.trim() !== "" && ws) {
      if (reply) {
        ws.send(
          JSON.stringify({
            type: "reply",
            groupID: selectedGroup.groupID,
            reply,
            message,
          })
        );
        setReply(null);
      } else if (edit) {
        ws.send(
          JSON.stringify({
            type: "edit",
            groupID: selectedGroup.groupID,
            edit,
            message,
          })
        );
        setEdit(false);
      } else {
        ws.send(
          JSON.stringify({
            type: "message",
            groupID: selectedGroup.groupID,
            message,
          })
        );
      }
      setMessage("");
    }
  };

  return (
    <input
      ref={inputRef}
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

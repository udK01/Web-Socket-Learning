import { useEffect, useRef, useState } from "react";

import { useWebSocket } from "../Providers/WebSocketProvider";
import { useGroup } from "../Providers/GroupProvider";

export default function SendMessage({
  reply,
  setReply,
  edit,
  setEdit,
  selectedMessage,
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const { ws } = useWebSocket();
  const { selectedGroup } = useGroup();

  // Automatically Select Input Field On Edit or Reply.
  useEffect(() => {
    edit ? setMessage(selectedMessage.message) : setMessage("");

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
            groupID: selectedGroup._id,
            reply,
            message,
          })
        );
        setReply(null);
      } else if (edit) {
        ws.send(
          JSON.stringify({
            type: "edit",
            groupID: selectedGroup._id,
            edit,
            message,
          })
        );
        setEdit(false);
      } else {
        ws.send(
          JSON.stringify({
            type: "message",
            groupID: selectedGroup._id,
            message,
          })
        );
      }
      setMessage("");
    }
  };

  return (
    <div className="w-full h-[10%] px-3 pb-3">
      <textarea
        ref={inputRef}
        className="w-full h-full dark:bg-secondary bg-secondary_light ring-4 dark:ring-primary ring-primary_light rounded-md p-2 resize-none"
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
    </div>
  );
}

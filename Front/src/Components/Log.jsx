import React, { useEffect, useRef, useState } from "react";

import { useWebSocket } from "../WebSocketProvider";
import { useUser } from "../UserProvider";

export default function Log() {
  const [messageData, setMessageData] = useState([]);
  const messagesEndRef = useRef(null);

  const { profilePicture } = useUser();
  const { ws } = useWebSocket();

  // History - Message Updater.
  useEffect(() => {
    if (ws) {
      const handleMessage = ({ data }) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "history") {
          setMessageData(parsedData.messages);
        } else {
          setMessageData((prevMessages) => [...prevMessages, parsedData.data]);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws]);

  // Smooth Scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  return (
    <div className="w-full h-[90%]">
      <div className="p-4 text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
        {messageData
          .filter((msg) => msg !== undefined)
          .map((msg, index) => (
            <div key={index} className="mb-2 flex flex-col">
              <div className="flex items-center gap-3">
                <img
                  src={msg.profilePicture}
                  className="size-10 ring-1 ring-white rounded-full"
                />
                <span className="font-bold text-sm text-gray-300">
                  {msg.nickname}
                </span>
              </div>
              <span>{msg.message}</span>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

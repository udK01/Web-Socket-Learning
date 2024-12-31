import React, { useEffect, useRef, useState } from "react";

import { useWebSocket } from "./WebSocketProvider";
import { useUser } from "./UserProvider";

import EditUser from "./EditUser";

export default function App() {
  const { nickname, profilePicture } = useUser();
  const { ws } = useWebSocket();

  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);
  const messagesEndRef = useRef(null);

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

  // Message Handler
  const handleSendMessage = () => {
    if (message.trim() !== "" && ws) {
      ws.send(
        JSON.stringify({
          type: "message",
          message,
        })
      );
      setMessage("");
    }
  };

  return (
    <section className="h-screen bg-slate-600 flex flex-col justify-center items-center">
      {edit && <EditUser ws={ws} setEdit={setEdit} />}

      <div className="flex w-[40%] h-[60%]">
        <div className="w-[30%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div className="w-full h-[90%]"></div>
          <div
            className="w-full h-[10%] flex items-center gap-2 bg-slate-800 rounded-md p-2 hover:bg-slate-900 hover:cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <img
              src={profilePicture}
              className="w-10 h-10 rounded-full ring-1 ring-white"
            />
            <div className="text-white text-ellipsis line-clamp-1 text-[20px] whitespace-nowrap overflow-hidden">
              {nickname}
            </div>
          </div>
        </div>
        <div className="w-[70%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div className="w-full h-[90%]">
            <div className="p-4 text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
              {messageData
                .filter((msg) => msg !== undefined)
                .map((msg, index) => (
                  <div key={index} className="mb-2 flex flex-col">
                    <div className="flex items-center gap-3">
                      <img
                        src={profilePicture}
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
        </div>
      </div>
    </section>
  );
}

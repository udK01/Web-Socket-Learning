import { useState } from "react";

import User from "./Components/User";
import Log from "./Components/Log";

import { useWebSocket } from "./WebSocketProvider";

export default function App() {
  const [message, setMessage] = useState("");

  const { ws } = useWebSocket();

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
      <div className="flex w-[40%] h-[60%]">
        <div className="w-[30%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div className="w-full h-[90%]"></div>
          <User />
        </div>
        <div className="w-[70%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <Log />
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

import { useState } from "react";

export default function App() {
  const ws = new WebSocket("ws://localhost:8080");
  const [message, setMessage] = useState("");

  ws.addEventListener("message", ({ data }) => {
    console.log(data);
  });

  return (
    <section className="h-screen bg-slate-600 flex flex-col justify-center items-center">
      <img src="./logo.png" className="size-[120px]" />
      <div className="flex w-[40%] h-[60%]">
        <div className="w-[25%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
        <div className="w-[75%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div className="w-full h-[90%]"></div>
          <input
            className="w-full h-[10%] bg-transparent ring-1 rounded-md p-2 text-left align-top resize-none overflow-y-auto focus:outline-none text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (message.trim() !== "") {
                  ws.send(message);
                  setMessage("");
                }
              }
            }}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </section>
  );
}

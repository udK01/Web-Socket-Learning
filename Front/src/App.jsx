import { useEffect, useRef, useState } from "react";

export default function App() {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
      console.log("WebSocket connected!");
    });

    socket.addEventListener("message", ({ data }) => {
      const parsedData = JSON.parse(data);
      setMessageData((prevMessages) => [...prevMessages, ...parsedData]);
    });

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  const handleSendMessage = () => {
    if (message.trim() !== "" && ws) {
      ws.send(message);
      setMessage("");
    }
  };

  return (
    <section className="h-screen bg-slate-600 flex flex-col justify-center items-center">
      <img src="./logo.png" className="size-[120px]" />
      <div className="flex w-[40%] h-[60%]">
        <div className="w-[25%] bg-slate-700 ring-4 ring-slate-800 rounded-md"></div>
        <div className="w-[75%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div className="w-full h-[90%]">
            <div className="p-4 text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
              {messageData.map((message, index) => (
                <p key={index}>{message}</p>
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

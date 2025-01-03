import React, { useEffect, useRef, useState } from "react";

import { ImBin } from "react-icons/im";
import { FaReply } from "react-icons/fa";

import { useWebSocket } from "../WebSocketProvider";

export default function Log() {
  const [messageData, setMessageData] = useState([]);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const { ws } = useWebSocket();

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  useEffect(() => {
    if (showMenu && menuRef.current) {
      menuRef.current.focus();
    }
  }, [showMenu]);

  const handleRightClick = (event, msg) => {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setShowMenu(true);
    setSelectedMessage(msg);
  };

  const handleBlur = () => {
    setShowMenu(false);
    setSelectedMessage(null);
  };

  return (
    <div className="w-full h-[90%]">
      <div className="p-4 text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
        {messageData
          .filter((msg) => msg !== undefined)
          .map((msg, index) => (
            <div
              key={index}
              className="mb-2 flex flex-col rounded-md p-2 hover:bg-slate-800 hover:cursor-pointer"
              onContextMenu={(e) => handleRightClick(e, msg)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={msg.profilePicture}
                  alt="Profile"
                  className="size-10 ring-1 ring-white rounded-full"
                />
                <span className="font-bold text-sm text-gray-300 hover:underline hover:cursor-pointer">
                  {msg.nickname}
                </span>
              </div>
              <span>{msg.message}</span>
            </div>
          ))}

        {showMenu && (
          <ul
            ref={menuRef}
            tabIndex={0}
            className="absolute bg-slate-800 z-50"
            style={{ top: menuPosition.y, left: menuPosition.x }}
            onBlur={handleBlur}
          >
            <li className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer">
              <FaReply /> Reply to {selectedMessage?.nickname}
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer text-red-500">
              <ImBin /> Delete Message
            </li>
          </ul>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

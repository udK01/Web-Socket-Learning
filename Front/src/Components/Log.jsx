import React, { useEffect, useRef, useState } from "react";

import { ImBin } from "react-icons/im";
import { FaReply } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useWebSocket } from "../WebSocketProvider";
import { useUser } from "../UserProvider";

export default function Log() {
  const [messageData, setMessageData] = useState([]);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const { ws } = useWebSocket();
  const { userID } = useUser();

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState(false);

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

  const handleReply = () => {
    setShowMenu(false);
    setReply(true);
  };

  return (
    <div className="w-full h-[90%]">
      <div className="h-[92%] p-4 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
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
            className="absolute bg-slate-800 border-2 border-slate-900 rounded-md z-50"
            style={{ top: menuPosition.y, left: menuPosition.x }}
            onBlur={handleBlur}
          >
            <li
              className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer"
              onClick={handleReply}
            >
              <FaReply /> Reply to {selectedMessage?.nickname}
            </li>
            {selectedMessage.userID === userID && (
              <>
                <div className="h-[1px] w-[95%] mx-auto bg-slate-900" />
                <li className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer text-red-500">
                  <ImBin /> Delete Message
                </li>
              </>
            )}
          </ul>
        )}
        <div ref={messagesEndRef} />
      </div>
      {reply && (
        <div className="w-full h-[8%] flex items-center justify-between rounded-t-md bg-slate-900 text-gray-300 pl-2">
          <div>
            Replying to
            <span className="text-white ml-1 hover:underline hover:cursor-pointer">
              {selectedMessage.nickname}
            </span>
          </div>
          <div
            className="w-10 h-full flex items-center justify-center rounded-t-md bg-slate-950 hover:bg-black hover:cursor-pointer"
            onClick={() => setReply(false)}
          >
            <IoIosClose className="size-10 hover:text-red-500 transition-colors duration-300 ease-in-out" />
          </div>
        </div>
      )}
    </div>
  );
}

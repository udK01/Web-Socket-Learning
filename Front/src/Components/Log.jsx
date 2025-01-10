import React, { useEffect, useRef, useState } from "react";

import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useWebSocket } from "../WebSocketProvider";
import { useGroup } from "../GroupProvider";
import { useUser } from "../UserProvider";

import SendMessage from "./SendMessage";

export default function Log() {
  const [messageData, setMessageData] = useState([]);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const { ws } = useWebSocket();
  const { userID } = useUser();
  const { groups, selectedGroup } = useGroup();

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState(null);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (ws && selectedGroup) {
      const handleMessage = ({ data }) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "message") {
          const { groupID } = parsedData.data;

          const targetGroup = groups.find((group) => group.groupID === groupID);

          if (targetGroup) {
            targetGroup.messages = [...targetGroup.messages, parsedData.data];

            if (selectedGroup && selectedGroup.groupID === groupID) {
              setMessageData(targetGroup.messages);
            }
          }
        }
      };

      setMessageData(selectedGroup.messages);

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    } else if (!selectedGroup) {
      setMessageData([]);
    }
  }, [ws, selectedGroup]);

  // Smooth Scroll.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  // Automatically Select Menu.
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
    setReply(selectedMessage);
  };

  const handleEdit = () => {
    setShowMenu(false);
    setEdit(selectedMessage);
  };

  const handleDelete = () => {
    setShowMenu(false);
    ws.send(
      JSON.stringify({
        type: "delete",
        selectedMessage,
      })
    );
  };

  const renderBar = (type, text, action) => {
    return (
      <div className="w-full h-[8%] flex items-center justify-between rounded-t-md bg-slate-900 text-gray-300 pl-2">
        <div>
          {type === "reply" && (
            <>
              Replying to
              <span className="text-white ml-1 hover:underline hover:cursor-pointer">
                {text}
              </span>
            </>
          )}
          {type === "edit" && "Editing message..."}
        </div>
        <div
          className="w-10 h-full flex items-center justify-center rounded-t-md bg-slate-950 hover:bg-black hover:cursor-pointer"
          onClick={action}
        >
          <IoIosClose className="size-10 hover:text-red-500 transition-colors duration-300 ease-in-out" />
        </div>
      </div>
    );
  };

  const RegularMessage = ({ msg }) => {
    return (
      <>
        <div className="flex items-center gap-3">
          <img
            src={msg.profilePicture}
            alt="Profile"
            className="size-10 ring-1 ring-white rounded-full"
          />
          <span className="text-[16px] font-bold text-sm text-gray-300 hover:underline hover:cursor-pointer">
            {msg.nickname}
          </span>
        </div>
        <span>{msg.message}</span>
      </>
    );
  };

  const ReplyMessage = ({ msg }) => {
    const parent = msg.parent;

    return (
      <>
        <div>
          <div className="ml-5 flex items-center gap-1">
            <div className="border-l border-t w-7 h-3 border-gray-300 rounded-tl-lg" />
            <img
              src={parent.profilePicture}
              alt="Profile"
              className="size-5 ring-1 ring-white rounded-full"
            />
            <span className="text-[16px] font-bold text-sm text-gray-300 hover:underline hover:cursor-pointer">
              {parent.nickname}
            </span>
            <span className="text-gray-300 line-clamp-1 text-ellipsis text-[12px]">
              {parent.message}
            </span>
          </div>
          <RegularMessage msg={msg} />
        </div>
      </>
    );
  };

  return (
    <div className="w-full h-full">
      <div
        className={`${
          reply || edit ? "h-[82%]" : "h-[90%]"
        } p-4 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent`}
      >
        {messageData
          .filter((msg) => msg !== undefined)
          .map((msg, index) => (
            <div
              key={index}
              className="mb-2 flex flex-col rounded-md p-2 hover:bg-slate-800 hover:cursor-pointer"
              onContextMenu={(e) => handleRightClick(e, msg)}
            >
              {msg.parent === null ? (
                <RegularMessage msg={msg} />
              ) : (
                <ReplyMessage msg={msg} />
              )}
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
                <li
                  className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer"
                  onClick={handleEdit}
                >
                  <FaEdit /> Edit Message
                </li>
                <div className="h-[1px] w-[95%] mx-auto bg-slate-900" />
                <li
                  className="flex items-center gap-2 p-2 hover:bg-slate-900 hover:cursor-pointer text-red-500"
                  onClick={handleDelete}
                >
                  <ImBin /> Delete Message
                </li>
              </>
            )}
          </ul>
        )}
        <div ref={messagesEndRef} />
      </div>

      {reply && renderBar("reply", reply?.nickname, () => setReply(null))}
      {edit && renderBar("edit", null, () => setEdit(null))}

      {selectedGroup && (
        <SendMessage
          reply={reply}
          setReply={setReply}
          edit={edit}
          setEdit={setEdit}
        />
      )}
    </div>
  );
}

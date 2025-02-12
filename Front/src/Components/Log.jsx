import React, { useEffect, useRef, useState } from "react";

import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useWebSocket } from "../Providers/WebSocketProvider";
import { useGroup } from "../Providers/GroupProvider";
import { useUser } from "../Providers/UserProvider";

import SendMessage from "./SendMessage";

export default function Log() {
  const [messageData, setMessageData] = useState([]);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const { ws } = useWebSocket();
  const { userID } = useUser();
  const { groups, setGroups, selectedGroup } = useGroup();

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState(null);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (ws) {
      const handleMessage = ({ data }) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "message") {
          const { groupID } = parsedData.data;

          setGroups((prevGroups) =>
            prevGroups.map((group) =>
              group._id === groupID
                ? {
                    ...group,
                    messages: [...(group.messages || []), parsedData.data],
                  }
                : group
            )
          );

          if (selectedGroup && selectedGroup._id === groupID) {
            setMessageData((prev) => [...prev, parsedData.data]);
          }
        } else if (parsedData.type === "edited_messages") {
          setGroups((prevGroups) =>
            prevGroups.map((group) =>
              group._id === selectedGroup?._id
                ? { ...group, messages: [...parsedData.messages] }
                : group
            )
          );

          if (selectedGroup) {
            setMessageData([...parsedData.messages]);
          }
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws, selectedGroup, setGroups]);

  useEffect(() => {
    if (selectedGroup) {
      setMessageData(selectedGroup.messages || []);
    } else {
      setMessageData([]);
    }
  }, [selectedGroup]);

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
    setEdit(false);
    setReply(selectedMessage);
  };

  const handleEdit = () => {
    setShowMenu(false);
    setReply(false);
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
      <div className="w-full h-[4%] flex items-center justify-between px-3 dark:text-gray-300 text-black">
        <div className="w-full h-full flex items-center px-3 rounded-t-md dark:bg-primary bg-primary_light">
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
          className="w-10 h-full flex items-center justify-center rounded-t-md dark:bg-tertiary bg-tertiary_light dark:hover:bg-black hover:bg-white hover:cursor-pointer"
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
            className="size-10 ring-1 dark:ring-white ring-black rounded-full"
          />
          <span className="text-[16px] font-bold text-sm dark:text-gray-300 text-black hover:underline hover:cursor-pointer">
            {msg.nickname}
          </span>
        </div>
        <span>{msg.message}</span>
      </>
    );
  };

  const ReplyMessage = ({ msg }) => {
    const parent = messageData.find((message) => message._id === msg.parent);

    return (
      <>
        <div>
          <div className="ml-5 flex items-center gap-1">
            <div className="border-l border-t w-7 h-3 dark:border-gray-300 border-black rounded-tl-lg" />
            <img
              src={parent?.profilePicture || "base.png"}
              alt="Profile"
              className="size-5 ring-1 dark:ring-white ring-black rounded-full"
            />
            <span className="text-[16px] font-bold text-sm dark:text-gray-300 text-black hover:underline hover:cursor-pointer">
              {parent?.nickname || "Anonymous"}
            </span>
            <span className="dark:text-gray-300 text-black line-clamp-1 text-ellipsis text-[12px]">
              {parent?.message || "Deleted Comment."}
            </span>
          </div>
          <RegularMessage msg={msg} />
        </div>
      </>
    );
  };

  const Menu = () => {
    return (
      <ul
        ref={menuRef}
        tabIndex={0}
        className="absolute dark:bg-primary bg-primary_light border-2 dark:border-tertiary border-tertiary_light rounded-md z-50"
        style={{ top: menuPosition.y, left: menuPosition.x }}
        onBlur={handleBlur}
      >
        <li
          className="flex items-center gap-2 p-2 dark:hover:bg-tertiary hover:bg-tertiary_light hover:cursor-pointer"
          onClick={handleReply}
        >
          <FaReply /> Reply to {selectedMessage?.nickname}
        </li>
        {selectedMessage.userID === userID && (
          <>
            <div className="h-[1px] w-[95%] mx-auto dark:bg-tertiary bg-tertiary_light" />
            <li
              className="flex items-center gap-2 p-2 dark:hover:bg-tertiary hover:bg-tertiary_light hover:cursor-pointer"
              onClick={handleEdit}
            >
              <FaEdit /> Edit Message
            </li>
            <div className="h-[1px] w-[95%] mx-auto dark:bg-tertiary bg-tertiary_light" />
            <li
              className="flex items-center gap-2 p-2 dark:hover:bg-tertiary hover:bg-tertiary_light hover:cursor-pointer text-red-500"
              onClick={handleDelete}
            >
              <ImBin /> Delete Message
            </li>
          </>
        )}
      </ul>
    );
  };

  return (
    <div className="w-full h-full">
      <div
        className={`${
          reply || edit ? "h-[86%]" : "h-[90%]"
        } p-4 overflow-auto scrollbar-thin dark:scrollbar-thumb-tertiary scrollbar-thumb-tertiary_light scrollbar-track-transparent`}
      >
        {messageData
          .filter((msg) => msg !== undefined)
          .map((msg, index) => (
            <div
              key={index}
              className="mb-2 flex flex-col break-words rounded-md w-full p-2 dark:hover:bg-secondary hover:bg-secondary_light hover:cursor-pointer"
              onContextMenu={(e) => handleRightClick(e, msg)}
            >
              {msg.parent === null ? (
                <RegularMessage msg={msg} />
              ) : (
                <ReplyMessage msg={msg} />
              )}
            </div>
          ))}

        {showMenu && <Menu />}
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
          selectedMessage={selectedMessage}
        />
      )}
    </div>
  );
}

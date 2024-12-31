import React, { useState } from "react";

import { useWebSocket } from "../WebSocketProvider";
import { useUser } from "../UserProvider";

const User = () => {
  const { nickname, profilePicture, setNickname, setProfilePicture } =
    useUser();
  const { ws } = useWebSocket();

  const [edit, setEdit] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    let newNick = document.getElementById("nameInput").value;

    setEdit(false);
    if (newNick.trim() !== "") {
      setNickname(newNick);
    }

    if (ws) {
      ws.send(
        JSON.stringify({
          type: "update_user",
          updatedNickname: nickname,
          updatedProfilePicture: profilePicture,
        })
      );
    }
  };

  const DisplayUser = () => {
    return (
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
    );
  };

  const DisplayEdit = () => {
    return (
      <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
        <div className="relative w-[20%] bg-purple-600 bg-opacity-50 ring-4 rounded-md ring-purple-700">
          <button
            className="absolute top-2 right-2 text-white bg-purple-700 hover:bg-purple-800 rounded-full w-8 h-8 flex justify-center items-center"
            onClick={() => setEdit(false)}
          >
            X
          </button>
          <div className="flex flex-col h-full items-center justify-center space-y-3 p-2">
            <img
              src={profilePicture}
              className="w-40 h-40 hover:cursor-pointer hover:bg-purple-800 rounded-full object-cover"
              alt="Profile"
              onClick={() =>
                document.getElementById("profilePictureInput").click()
              }
            />
            <input
              id="profilePictureInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            <input
              id="nameInput"
              placeholder={`${nickname}`}
              className="w-[90%] bg-transparent text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              className="text-white rounded-md ring-2 ring-purple-900 bg-purple-800 px-6 py-1 hover:bg-purple-900 hover:ring-purple-950"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return edit ? (
    <>
      <DisplayUser />
      <DisplayEdit />
    </>
  ) : (
    <DisplayUser />
  );
};

export default User;

import React, { useRef, useState } from "react";
import axios from "axios";

import { useWebSocket } from "../Providers/WebSocketProvider";
import { useGroup } from "../Providers/GroupProvider";
import { useUser } from "../Providers/UserProvider";

const User = () => {
  const { userID, nickname, profilePicture, setNickname, setProfilePicture } =
    useUser();
  const { ws } = useWebSocket();
  const { selectedGroup } = useGroup();

  const [edit, setEdit] = useState(false);

  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const handleProfilePictureChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userID", userID);

    try {
      const response = await axios.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfilePicture(response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setEdit(false);
    const newNick = nameInputRef.current.value;
    const newProfilePicture = fileInputRef.current.files[0];

    try {
      let profilePictureResponse = null;

      if (newProfilePicture) {
        profilePictureResponse = await handleProfilePictureChange(
          newProfilePicture
        );
      }

      if (newNick.trim() !== "") {
        setNickname(newNick);

        if (ws) {
          ws.send(
            JSON.stringify({
              type: "update_user",
              updatedNickname: newNick,
              updatedProfilePicture: profilePictureResponse,
              groupID: selectedGroup.groupID,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const DisplayUser = () => {
    return (
      <div
        className="w-full h-[10%] flex items-center justify-center gap-2 bg-primary rounded-md p-2 hover:bg-accent hover:cursor-pointer"
        onClick={() => setEdit(true)}
      >
        <img
          src={profilePicture}
          className="size-16 rounded-full ring-1 ring-white"
        />
        <div className="text-white text-ellipsis line-clamp-1 text-[30px] whitespace-nowrap overflow-hidden">
          {nickname}
        </div>
      </div>
    );
  };

  const DisplayEdit = () => {
    return (
      <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
        <div className="relative w-[20%] bg-primary bg-opacity-50 ring-4 rounded-md ring-tertiary">
          <button
            className="absolute top-2 right-2 text-white bg-primary hover:bg-tertiary rounded-full size-8 flex justify-center items-center"
            onClick={() => setEdit(false)}
          >
            X
          </button>
          <div className="flex flex-col h-full items-center justify-center space-y-3 p-2">
            <img
              src={profilePicture}
              className="w-40 h-40 hover:cursor-pointer hover:bg-accent rounded-full object-cover"
              alt="Profile"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <input
              ref={nameInputRef}
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
              className="text-white rounded-md ring-2 ring-accent bg-primary px-6 py-1 hover:bg-accent"
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

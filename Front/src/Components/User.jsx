import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import GoogleAuth from "./GoogleAuth";

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
  const [preview, setPreview] = useState(profilePicture);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file for submission
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview !== profilePicture) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    setPreview(profilePicture);
  }, [profilePicture]);

  const handleProfilePictureChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userID", userID);
    formData.append("profilePicture", profilePicture);

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

    try {
      let profilePictureResponse = profilePicture;

      if (selectedFile) {
        profilePictureResponse = await handleProfilePictureChange(selectedFile);
        setProfilePicture(profilePictureResponse);
      }

      if (newNick.trim() !== "") {
        setNickname(newNick);
      }

      ws.send(
        JSON.stringify({
          type: "update_user",
          updatedNickname: newNick || nickname,
          updatedProfilePicture: profilePictureResponse,
          groupID: selectedGroup?._id.toString() || null,
        })
      );

      setSelectedFile(null);
      setPreview(profilePictureResponse);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  // const handleSubmit = async () => {
  //   setEdit(false);
  //   const newNick = nameInputRef.current.value;
  //   const newProfilePicture = fileInputRef.current.files[0];

  //   try {
  //     let profilePictureResponse = profilePicture;

  //     if (newProfilePicture) {
  //       profilePictureResponse = await handleProfilePictureChange(
  //         newProfilePicture
  //       );
  //       ws.send(
  //         JSON.stringify({
  //           type: "update_user",
  //           updatedNickname: nickname,
  //           updatedProfilePicture: profilePictureResponse,
  //           groupID: selectedGroup?._id.toString() || null,
  //         })
  //       );
  //     }

  //     if (newNick.trim() !== "") {
  //       setNickname(newNick);

  //       if (ws) {
  //         ws.send(
  //           JSON.stringify({
  //             type: "update_user",
  //             updatedNickname: newNick,
  //             updatedProfilePicture: profilePictureResponse,
  //             groupID: selectedGroup?._id.toString() || null,
  //           })
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }

  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const DisplayUser = () => {
    return (
      <div
        className="w-full h-[10%] flex items-center justify-center gap-2 dark:bg-primary bg-primary_light rounded-md p-2 dark:hover:bg-accent hover:bg-accent_light hover:cursor-pointer"
        onClick={() => setEdit(true)}
      >
        <img
          src={profilePicture}
          className="xl:size-16 md:size-12 xs:size-10 2xs:size-6 rounded-full ring-1 dark:ring-white ring-black object-cover"
        />
        <div className="text-ellipsis line-clamp-1 xl:text-[30px] md:text-[24px] whitespace-nowrap overflow-hidden">
          {nickname}
        </div>
      </div>
    );
  };

  const DisplayEdit = () => {
    return (
      <div className="absolute top-0 left-0 flex justify-center items-center w-screen h-full dark:bg-tertiary/50 bg-primary_light/50">
        <div className="relative w-[30%] max-w-[300px] min-w-[250px] bg-primary_light dark:bg-primary bg-opacity-50 ring-4 rounded-md dark:ring-tertiary ring-tertiary_light">
          <button
            className="absolute top-2 right-2 dark:bg-primary bg-primary_light dark:hover:bg-tertiary hover:bg-tertiary_light rounded-full size-8 flex justify-center items-center"
            onClick={() => setEdit(false)}
          >
            X
          </button>
          <div className="flex flex-col h-full items-center justify-center space-y-3 p-2">
            <GoogleAuth />
            <img
              src={preview || profilePicture}
              className="w-40 h-40 hover:cursor-pointer dark:hover:bg-accent hover:bg-accent_light rounded-full object-cover"
              alt="Profile"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={nameInputRef}
              placeholder={`${nickname}`}
              className="w-[90%] bg-transparent text-center placeholder-black dark:placeholder-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              className="rounded-md ring-2 dark:ring-accent ring-accent_light dark:bg-primary bg-primary_light px-6 py-1 dark:hover:bg-accent hover:bg-accent_light"
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

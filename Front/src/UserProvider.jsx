import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nickname, setNickname] = useState("Anonymous");
  const [profilePicture, setProfilePicture] = useState("logo.png");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
      console.log("WebSocket connected!");
    });

    socket.addEventListener("message", ({ data }) => {
      const parsedData = JSON.parse(data);

      if (parsedData.type === "user") {
        setNickname(parsedData.nickname);
        setProfilePicture(parsedData.profilePicture);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ nickname, profilePicture, setNickname, setProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

import React, { createContext, useState, useEffect, useContext } from "react";
import { useWebSocket } from "./WebSocketProvider";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { ws } = useWebSocket();

  const [nickname, setNickname] = useState("Anonymous");
  const [profilePicture, setProfilePicture] = useState("logo.png");

  useEffect(() => {
    if (ws) {
      const handleMessage = ({ data }) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "user") {
          setNickname(parsedData.nickname);
          setProfilePicture(parsedData.profilePicture);
        }
      };
    }
  }, [ws]);

  return (
    <UserContext.Provider
      value={{ nickname, profilePicture, setNickname, setProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

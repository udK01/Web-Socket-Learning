import React, { createContext, useState, useEffect, useContext } from "react";
import { useWebSocket } from "./WebSocketProvider";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { ws } = useWebSocket();

  const [userID, setUserID] = useState(null);
  const [nickname, setNickname] = useState("Anonymous");
  const [profilePicture, setProfilePicture] = useState("base.png");

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user") {
        const { userID, nickname, profilePicture } = data;
        setUserID(userID);
        setNickname(nickname);
        setProfilePicture(profilePicture);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  return (
    <UserContext.Provider
      value={{
        userID,
        setUserID,
        nickname,
        profilePicture,
        setNickname,
        setProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

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

    let sessionID = sessionStorage.getItem("sessionID");

    if (!sessionID) {
      sessionID = crypto.randomUUID(); // Generate new session ID
      sessionStorage.setItem("sessionID", sessionID);
    }

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "session", sessionID })); // Send sessionID to server
    });

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user") {
        const { _id, nickname, profilePicture } = data.user;
        setUserID(_id.toString());
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

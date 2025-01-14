import React, { createContext, useState, useEffect, useContext } from "react";
import { useWebSocket } from "./WebSocketProvider";

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const { ws } = useWebSocket();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "groups") {
        setGroups(data.groups);
      } else if (data.type === "clear_selected") {
        setSelectedGroup(null);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  return (
    <GroupContext.Provider
      value={{
        groups,
        setGroups,
        selectedGroup,
        setSelectedGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);

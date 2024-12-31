import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nickname, setNickname] = useState("Anonymous");
  const [profilePicture, setProfilePicture] = useState("logo.png");

  return (
    <UserContext.Provider
      value={{ nickname, profilePicture, setNickname, setProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

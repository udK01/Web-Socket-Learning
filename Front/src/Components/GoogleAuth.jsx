import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import React, { useEffect } from "react";
import axios from "axios";

import { useUser } from "../Providers/UserProvider";
import { useGroup } from "../Providers/GroupProvider";
import { useWebSocket } from "../Providers/WebSocketProvider";

export default function GoogleAuth() {
  const { userID, nickname, setNickname, profilePicture, setProfilePicture } =
    useUser();
  const { selectedGroup } = useGroup();
  const { ws } = useWebSocket();

  const user = { userID, nickname, profilePicture };
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "update_user") {
        const { updatedNickname, updatedProfilePicture } = data;
        ws.send(
          JSON.stringify({
            type: "update_user",
            updatedNickname: updatedNickname,
            updatedProfilePicture: updatedProfilePicture,
            groupID: selectedGroup?._id.toString() || null,
          })
        );
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  const handleLogin = (credentialResponse) => {
    const token = credentialResponse.credential;
    axios
      .post("http://localhost:3000/api/auth/google", { token, user })
      .then((response) => {
        const { name, picture } = response.data.googleUser;
        setNickname(name);
        setProfilePicture(picture);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Login Failed")}
        theme="outline"
        size="large"
        shape="circle"
      />
    </GoogleOAuthProvider>
  );
}

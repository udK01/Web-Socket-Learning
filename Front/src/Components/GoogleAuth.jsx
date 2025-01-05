import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import React from "react";
import axios from "axios";

import { useUser } from "../UserProvider";

export default function GoogleAuth() {
  const { userID, setNickname, setProfilePicture } = useUser();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLogin = (credentialResponse) => {
    const token = credentialResponse.credential;

    axios
      .post("http://localhost:3000/api/auth/google", { token, userID })
      .then((response) => {
        const { name, picture } = response.data.user;
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

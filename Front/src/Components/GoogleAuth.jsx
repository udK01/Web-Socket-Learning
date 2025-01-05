import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function GoogleAuth() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLogin = (credentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    // Send the token to your backend for verification
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div>
        <h1>Login with Google</h1>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

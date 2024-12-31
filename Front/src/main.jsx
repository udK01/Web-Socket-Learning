import { WebSocketProvider } from "./WebSocketProvider.jsx";
import { UserProvider } from "./UserProvider.jsx";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WebSocketProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </WebSocketProvider>
  </StrictMode>
);

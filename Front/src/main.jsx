import { WebSocketProvider } from "./WebSocketProvider.jsx";
import { GroupProvider } from "./GroupProvider.jsx";
import { UserProvider } from "./UserProvider.jsx";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WebSocketProvider>
      <UserProvider>
        <GroupProvider>
          <App />
        </GroupProvider>
      </UserProvider>
    </WebSocketProvider>
  </StrictMode>
);

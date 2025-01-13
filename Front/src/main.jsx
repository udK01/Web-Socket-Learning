import { WebSocketProvider } from "./Providers/WebSocketProvider.jsx";
import { GroupProvider } from "./Providers/GroupProvider.jsx";
import { UserProvider } from "./Providers/UserProvider.jsx";
import { ThemeProvider } from "./Providers/ThemeProvider.jsx";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <WebSocketProvider>
        <UserProvider>
          <GroupProvider>
            <App />
          </GroupProvider>
        </UserProvider>
      </WebSocketProvider>
    </ThemeProvider>
  </StrictMode>
);

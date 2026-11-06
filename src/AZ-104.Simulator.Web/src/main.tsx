import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import { DisplaySettingsProvider } from "./settings/DisplaySettingsContext";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DisplaySettingsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DisplaySettingsProvider>
    </ThemeProvider>
  </StrictMode>,
);

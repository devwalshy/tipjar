import { createRoot } from "react-dom/client";
import App from "./App";
import "@/assets/styles/global.css";
import { AppThemeProvider } from "@/components/providers/AppThemeProvider";

createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <App />
  </AppThemeProvider>,
);

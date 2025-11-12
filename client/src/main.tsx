import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    data-oid="q3.ii-e"
  >
    <App data-oid="vlpy5cr" />
  </ThemeProvider>,
);

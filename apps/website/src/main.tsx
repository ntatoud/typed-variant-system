import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { Styleguide } from "./styleguide";

const renderStart = performance.now();

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Styleguide renderStart={renderStart} />
  </StrictMode>,
);

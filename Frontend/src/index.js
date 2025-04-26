import React from "react"; // Import React
import ReactDOM from "react-dom/client"; // Import ReactDOM
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Import App component
import "./index.css"; // Import global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
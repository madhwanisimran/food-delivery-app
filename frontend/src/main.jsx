import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import StoreContextProvider from "./components/context/StoreContext.jsx";
import AuthProvider from "./components/context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </AuthProvider>
  </BrowserRouter>
);

import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import "./Auth.css";

const AuthPanel = ({ show, onHide, initialView = "login" }) => {
  const [view, setView] = useState(initialView);

  const handleSwitch = (v) => setView(v);

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {view === "login" ? "Login to QuickBite" : "Create an account"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {view === "login" ? (
          <LoginForm onSwitch={() => handleSwitch("signup")} onClose={onHide} />
        ) : (
          <SignUpForm onSwitch={() => handleSwitch("login")} onClose={onHide} />
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AuthPanel;

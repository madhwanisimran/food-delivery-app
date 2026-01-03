import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
// import authService from "../../services/authService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const LoginForm = ({ onSwitch, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const validate = () => {
    const errs = {};
    if (!email || !email.trim()) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      toast.success("Login successful!");
      setEmail("");
      setPassword("");
      onClose();
    } else {
      setErrors({ general: result.message });
      toast.error(result.message);
    }
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="text-danger mb-2">{errors.general}</div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleChange("password", e.target.value)}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <div>
        <Button
          type="submit"
          variant="primary"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" className="me-2" /> : null}
          {loading ? "Logging in..." : "Login"}
        </Button>
        <p className="auth-note">Secure login � we never share your details.</p>
      </div>

      <div className="mt-3 small d-flex justify-content-between">
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitch();
            }}
          >
            Create an account
          </a>
        </div>
      </div>

      <div className="login-condition mt-3">
        <p>
          By logging in, you agree to our <span>Terms of Use</span> and{" "}
          <span>Privacy Policy</span>.
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;

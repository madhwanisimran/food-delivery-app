import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const SignUpForm = ({ onSwitch, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((e) => ({ ...e, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name || !form.name.trim()) errs.name = "Full name is required";
    if (!form.email || !form.email.trim()) errs.email = "Email is required";
    if (!form.password || form.password.length < 8)
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
    const result = await register(
      form.name.trim(),
      form.email.trim(),
      form.password
    );
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      onClose();
    } else {
      setErrors({ general: result.message });
      toast.error(result.message);
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="text-danger mb-2">{errors.general}</div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Full name</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Create Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Your Password"
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
          {loading ? "Creating..." : "Create account"}
        </Button>
        <a
          href="#"
          className="auth-helper-link"
          onClick={(e) => {
            e.preventDefault();
            onSwitch();
          }}
        >
          Already have an account? Log in
        </a>
        <p className="auth-note">
          By creating an account, you agree to our{" "}
          <span>Terms & Conditions</span>.
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;

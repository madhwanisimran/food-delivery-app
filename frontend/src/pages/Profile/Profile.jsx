import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

const getProfile = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : { name: "", email: "", phone: "" };
  } catch {
    return { name: "", email: "", phone: "" };
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(getProfile());
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(profile));
    setMessage("Profile saved");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4">Your Profile</h3>
      <Card>
        <Card.Body>
          <Form onSubmit={save}>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Save
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setProfile(getProfile());
                }}
              >
                Reset
              </Button>
              {message && (
                <div className="text-success align-self-center">{message}</div>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

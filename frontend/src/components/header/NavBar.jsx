import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import logo from "../../assets/quickbite-logo-transparent.png";
import "./Header.css";
import AuthPanel from "../Auth/AuthPanel";
import { StoreContext } from "../context/StoreContext";

export default function NavbarTop({ user, onLogout, onAuthSuccess }) {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [searchText, setSearchText] = useState("");

  const openAuth = (view = "login") => {
    setAuthView(view);
    setShowAuth(true);
  };

  const ctx = useContext(StoreContext);
  const cartCount =
    ctx && ctx.cart
      ? Object.values(ctx.cart).reduce((s, q) => s + Number(q || 0), 0)
      : 0;

  const handleProfile = () => navigate("/profile");
  const handleOrders = () => navigate("/orders");

  const handleAuthClose = () => {
    setShowAuth(false);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="navbar-top shadow-sm">
      <Container fluid className="px-5">
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <img src={logo} alt="QuickBite" height="40" />
          <span className="brand-name d-none d-md-inline">QUICKBITE</span>
        </Navbar.Brand>

        <Form
          className="search-inline d-none d-lg-flex mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchText.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
            }
          }}
        >
          <InputGroup style={{ width: "620px" }}>
            <InputGroup.Text className="location-pill">
              Setup your precise location
            </InputGroup.Text>
            <Form.Control
              placeholder="Search for restaurant and food"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="light"
              className="search-btn"
              type="submit"
            ></Button>
          </InputGroup>
        </Form>
        <Nav className="ms-auto align-items-center gap-3">
          {user && (
            <Nav.Item>
              <Button
                variant="light"
                className="position-relative"
                onClick={() => navigate("/cart")}
              >
                <i className="bi bi-cart" style={{ fontSize: "1.05rem" }}></i>
                {cartCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute"
                    style={{ top: -6, right: -6 }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Nav.Item>
          )}

          {user ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                id="user-dropdown"
                className="user-icon-dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <PersonCircle
                  size={32}
                  className="user-avatar"
                  title={user.name}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>{user.name}</Dropdown.Header>
                <Dropdown.Divider />
                {user.role === "admin" && (
                  <Dropdown.Item onClick={() => navigate("/admin")}>
                    <i className="bi bi-speedometer2 me-2"></i>Admin
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={handleProfile}>
                  <i className="bi bi-person me-2"></i>Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handleOrders}>
                  <i className="bi bi-bag me-2"></i>Orders
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => openAuth("login")}
              className="px-3"
            >
              Sign In
            </Button>
          )}
        </Nav>
      </Container>
      <AuthPanel
        show={showAuth}
        onHide={handleAuthClose}
        initialView={authView}
      />
    </Navbar>
  );
}

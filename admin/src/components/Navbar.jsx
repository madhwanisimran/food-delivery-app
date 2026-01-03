import React from "react";
import { Container, Row, Col, Image, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import avatarImg from "../assets/profile_image.png";
import logo from "../assets/quickbite-logo-transparent.png";
import adminAuthService from "../services/adminAuthService";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const admin = adminAuthService.getAdmin();
  const loggedIn = adminAuthService.isLoggedIn();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={12} className="brand d-flex flex-column align-items-start">
            <Link to="/orders">
              <img src={logo} alt="QuickBite" className="brand-logo" />
            </Link>
            <span className="brand-text">Admin Panel</span>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <div className="profile">
              {!loggedIn && (
                <Link to="/login">
                  <Image src={avatarImg} roundedCircle width={50} height={50} />
                </Link>
              )}

              {loggedIn && (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    className="p-0 border-0"
                  >
                    <Image
                      src={admin?.avatar || avatarImg}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>{admin?.name || "Admin"}</Dropdown.Header>
                    <Dropdown.Item as={Link} to="/orders">
                      Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Navbar;

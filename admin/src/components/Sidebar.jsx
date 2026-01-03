import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import plusIcon from "../assets/add_icon.png";
import listIcon from "../assets/order_icon.png";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Container fluid>
        <Row className="sidebar-col">
          <Col md={3} className="sidebar-options">
            <div className="sidebar-option">
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  isActive ? "sidebar-btn active" : "sidebar-btn"
                }
              >
                <img src={plusIcon} alt="add-icon" />
                <span className="icon-text">Add Item</span>
              </NavLink>
            </div>
            <div className="sidebar-option">
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  isActive ? "sidebar-btn active" : "sidebar-btn"
                }
              >
                <img src={listIcon} alt="list-icon" />
                <span className="icon-text">List Items</span>
              </NavLink>
            </div>
            <div className="sidebar-option">
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive ? "sidebar-btn active" : "sidebar-btn"
                }
              >
                <img src={listIcon} alt="order-icon" />
                <span className="icon-text">Orders</span>
              </NavLink>
            </div>
          </Col>
          <Col md={9} className="content-col">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sidebar;

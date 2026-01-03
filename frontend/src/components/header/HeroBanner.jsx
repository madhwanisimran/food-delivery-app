import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Food from "../../assets/food.jpg"; // add a wide hero image here
import "./Header.css";

export default function HeroBanner() {
  return (
    <section className="hero-section">
      <img src={Food} alt="Hero" className="hero-bg" />
      <Container className="hero-overlay">
        <Row className="justify-content-start">
          <Col md={6} lg={6}>
            <div className="hero-text-box">
              <h1>Order Your<br/>Favourite Food Here</h1>
              <p className="lead">Hot meals delivered fast to your doorstep<br/>Fresh and Delicious, just a<br/>click away.</p>

            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

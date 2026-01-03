import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "./Footer.css";
import Logo from "../../assets/quickbite-logo-transparent.png";
import GooglePlay from "../../assets/icons-img/play_store.png";
import AppStore from "../../assets/icons-img/app_store.png";

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container fluid className="footer-top py-5">
        <Row className="gy-4 align-items-start">
          <Col xs={12} md={4} lg={3} className="footer-logo text-start">
            <Image src={Logo} alt="App Logo" className="mb-2 footer-logo-img" />
            <p className="copyright mb-0">© 2025 QuickBite Limited</p>
          </Col>

          <Col xs={6} md={2} lg={2}>
            <h6>Company</h6>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Corporate</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Refund Policy</a>
              </li>
              <li>
                <a href="#">Mini</a>
              </li>
            </ul>
          </Col>

          <Col xs={6} md={2} lg={2}>
            <h6>Contact Us</h6>
            <ul className="footer-links">
              <li>
                <a href="#">Help & Support</a>
              </li>
              <li>
                <a href="#">Partner with Us</a>
              </li>
              <li>
                <a href="#">Ride with Us</a>
              </li>
            </ul>
          </Col>
          <Col xs={6} md={2} lg={2}>
            <h6>Legal</h6>
            <ul className="footer-links">
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Investor Relations</a>
              </li>
            </ul>
          </Col>

          <Col xs={6} md={2} lg={2}>
            <h6>Available In</h6>
            <ul className="footer-links">
              <li>
                <a href="#">Bangalore</a>
              </li>
              <li>
                <a href="#">Hyderabad</a>
              </li>
              <li>
                <a href="#">Mumbai</a>
              </li>
              <li>
                <a href="#">Delhi</a>
              </li>
              <li>
                <a href="#">Pune</a>
              </li>
              <li>
                <a href="#">+ 50 cities</a>
              </li>
            </ul>
          </Col>

          <Col xs={12} md={4} lg={3} className="text-center social-col">
            <h6 className="social-links">Social Links</h6>
            <div className="social-icons d-flex justify-content-center gap-3 mt-2">
              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom py-3">
        <div className="download-row">
          <p className="download-text">
            For better experience, download the{" "}
            <strong>QuickBite app now</strong>
          </p>
          <div className="download-btns">
            <Image src={GooglePlay} alt="Get it on Google Play" />
            <Image src={AppStore} alt="Download on App Store" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  ListGroup,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import "../../styles/checkout.css";

const formatCurrency = (v) => `₹${Number(v).toFixed(2)}`;

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/order/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError("Could not load order details");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Error loading order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="checkout-container py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="checkout-card">
            <Card.Body>
              {order ? (
                (() => {
                  const isPaid = !!order.payment;
                  const method = (order.paymentMethod || "").toLowerCase();
                  const isCod = method === "cod";

                  if (isPaid) {
                    return (
                      <>
                        <div className="text-center mb-4">
                          <div
                            style={{
                              fontSize: "3rem",
                              color: "#28a745",
                              marginBottom: "16px",
                            }}
                          >
                            ✓
                          </div>
                          <h3
                            className="checkout-section-title"
                            style={{ borderBottom: "2px solid #28a745" }}
                          >
                            Payment Successful!
                          </h3>
                        </div>

                        <Card
                          className="mb-4"
                          style={{
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #eee",
                          }}
                        >
                          <Card.Body>
                            <p className="text-muted mb-2">
                              <strong>Order ID:</strong> {order._id}
                            </p>
                            <p className="text-muted mb-2">
                              <strong>Status:</strong>{" "}
                              <span
                                style={{ color: "#28a745", fontWeight: "600" }}
                              >
                                {order.status}
                              </span>
                            </p>
                            <p className="text-muted mb-0">
                              <strong>Date:</strong>{" "}
                              {order.date
                                ? new Date(order.date).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "-"}
                            </p>
                          </Card.Body>
                        </Card>

                        {order.address && (
                          <div className="mb-4">
                            <h5
                              className="fw-bold mb-3"
                              style={{ fontSize: "1rem" }}
                            >
                              Delivery Address
                            </h5>
                            <div
                              className="p-3"
                              style={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "6px",
                              }}
                            >
                              <p className="mb-1">
                                {order.address.firstName ||
                                  order.address.name ||
                                  ""}{" "}
                                {order.address.lastName || ""}
                              </p>
                              <p className="mb-1 text-muted">
                                {order.address.street ||
                                  order.address.billingAddress ||
                                  ""}
                              </p>
                              <p className="mb-1 text-muted">
                                {order.address.city || ""},{" "}
                                {order.address.state || ""}{" "}
                                {order.address.postalCode ||
                                  order.address.pincode ||
                                  ""}
                              </p>
                              <p className="mb-1 text-muted">
                                {order.address.country || ""}
                              </p>
                              <p className="mb-0 text-muted">
                                {order.address.phone ||
                                  order.address.contact ||
                                  ""}
                              </p>
                            </div>
                          </div>
                        )}

                        {order.items && order.items.length > 0 && (
                          <div className="mb-4">
                            <h5
                              className="fw-bold mb-3"
                              style={{ fontSize: "1rem" }}
                            >
                              Order Items
                            </h5>
                            <ListGroup
                              variant="flush"
                              className="checkout-items"
                            >
                              {order.items.map((item, idx) => (
                                <ListGroup.Item
                                  key={idx}
                                  className="checkout-item"
                                >
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <div className="fw-bold">{item.name}</div>
                                      <div className="checkout-item-qty">
                                        {item.quantity} ×{" "}
                                        {formatCurrency(item.price)}
                                      </div>
                                    </div>
                                    <div className="fw-bold">
                                      {formatCurrency(
                                        (item.price || 0) * item.quantity
                                      )}
                                    </div>
                                  </div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </div>
                        )}

                        <div
                          className="checkout-summary-total"
                          style={{
                            padding: "16px 0 0",
                            borderTop: "2px solid #f0f0f0",
                            marginTop: "16px",
                          }}
                        >
                          <span>Total Amount</span>
                          <span>{formatCurrency(order.amount)}</span>
                        </div>

                        <p
                          className="text-muted text-center mt-4"
                          style={{ fontSize: "0.9rem" }}
                        >
                          A confirmation email has been sent to your registered
                          email address.
                        </p>
                      </>
                    );
                  }

                  if (isCod) {
                    return (
                      <>
                        <div className="text-center mb-4">
                          <div
                            style={{
                              fontSize: "3rem",
                              color: "#28a745",
                              marginBottom: "16px",
                            }}
                          >
                            ✓
                          </div>
                          <h3
                            className="checkout-section-title"
                            style={{ borderBottom: "2px solid #28a745" }}
                          >
                            Order Placed Successfully!
                          </h3>
                        </div>

                        <Card
                          className="mb-4"
                          style={{
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #eee",
                          }}
                        >
                          <Card.Body>
                            <p className="text-muted mb-2">
                              <strong>Order ID:</strong> {order._id}
                            </p>
                            <p className="text-muted mb-2">
                              <strong>Payment:</strong>{" "}
                              <span
                                style={{ color: "#ff8c00", fontWeight: 600 }}
                              >
                                Not Paid (Cash on Delivery)
                              </span>
                            </p>
                            <p className="text-muted mb-0">
                              <strong>Date:</strong>{" "}
                              {order.date
                                ? new Date(order.date).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "-"}
                            </p>
                          </Card.Body>
                        </Card>

                        <p
                          className="text-muted text-center mt-4"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Your order will be paid on delivery. Keep your phone
                          available for delivery updates.
                        </p>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="text-center mb-4">
                        <div
                          style={{
                            fontSize: "3rem",
                            color: "#dc3545",
                            marginBottom: "16px",
                          }}
                        >
                          ✕
                        </div>
                        <h3
                          className="checkout-section-title"
                          style={{ borderBottom: "2px solid #dc3545" }}
                        >
                          Payment Failed
                        </h3>
                      </div>
                      <p className="text-muted text-center">
                        There was a problem processing your payment. Please try
                        again or contact support.
                      </p>
                      {error && (
                        <p className="text-danger text-center mt-2">{error}</p>
                      )}
                    </>
                  );
                })()
              ) : success ? (
                <>
                  <div className="text-center mb-4">
                    <div
                      style={{
                        fontSize: "3rem",
                        color: "#28a745",
                        marginBottom: "16px",
                      }}
                    >
                      ✓
                    </div>
                    <h3
                      className="checkout-section-title"
                      style={{ borderBottom: "2px solid #28a745" }}
                    >
                      Payment Successful!
                    </h3>
                  </div>
                  <p className="text-muted text-center mt-4">
                    A confirmation email has been sent to your registered email
                    address.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div
                      style={{
                        fontSize: "3rem",
                        color: "#dc3545",
                        marginBottom: "16px",
                      }}
                    >
                      ✕
                    </div>
                    <h3
                      className="checkout-section-title"
                      style={{ borderBottom: "2px solid #dc3545" }}
                    >
                      Payment Failed
                    </h3>
                  </div>
                  <p className="text-muted text-center">
                    There was a problem processing your payment. Please try
                    again or contact support.
                  </p>
                  {error && (
                    <p className="text-danger text-center mt-2">{error}</p>
                  )}
                </>
              )}

              <div className="d-grid gap-2 mt-4">
                <Button
                  variant={success ? "success" : "danger"}
                  onClick={() => navigate("/orders")}
                  size="lg"
                >
                  {success ? "View My Orders" : "Go Back"}
                </Button>
                {!success && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/placeorder")}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Verify;

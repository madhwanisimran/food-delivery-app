import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import api from "../../services/axiosInstance";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }

    if (authLoading) return;

    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch user's orders
        const response = await api.get("/order/my-orders");
        if (response.data?.success && response.data?.orders) {
          setOrders(response.data.orders);
        } else {
          setError(response.data?.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
        const errorMsg =
          err.response?.data?.message || "Network error while fetching orders";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user, authLoading, navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      "food processing": "info",
      "out for delivery": "primary",
      delivered: "success",
      pending: "warning",
    };
    return (
      <Badge bg={statusMap[status?.toLowerCase()] || "secondary"}>
        {status || "Processing"}
      </Badge>
    );
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4">Your Orders</h3>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && (
        <Card body className="text-danger mb-3">
          {error}
        </Card>
      )}

      {!loading && orders.length === 0 ? (
        <Card body className="text-center">
          You have not placed any orders yet.
        </Card>
      ) : (
        <ListGroup>
          {orders.map((o) => {
            const id = o._id || o.id;
            const isOpen = expandedOrder === id;
            return (
              <div key={id} className="mb-2">
                <ListGroup.Item className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">
                      Order #{String(id).substring(0, 8)}... —{" "}
                      {getStatusBadge(o.orderStatus || o.status)}
                    </div>
                    <div className="small text-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-1 small">
                      {o.items?.length || 0} items — {o.paymentMethod || "N/A"}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">
                      ₹{Number(o.amount || o.total || 0).toFixed(2)}
                    </div>
                    <div className="small text-muted">
                      {o.address?.name || ""}
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant={isOpen ? "secondary" : "outline-primary"}
                        onClick={() => setExpandedOrder(isOpen ? null : id)}
                      >
                        {isOpen ? "Hide details" : "View details"}
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>

                {isOpen && (
                  <Card body>
                    <h6 className="mb-2">Items</h6>
                    <ListGroup variant="flush">
                      {(o.items || []).map((it, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="d-flex justify-content-between"
                        >
                          <div>
                            <div className="fw-bold">
                              {it.name || it.title || it.foodName || "Item"}
                            </div>
                            <div className="small text-muted">
                              Qty: {it.qty || it.quantity || 1}
                            </div>
                          </div>
                          <div className="text-end">
                            <div>
                              ₹
                              {Number(it.price || it.unitPrice || 0).toFixed(2)}
                            </div>
                            <div className="small">
                              ₹
                              {Number(
                                (it.price || it.unitPrice || 0) *
                                  (it.qty || it.quantity || 1)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <hr />
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">Delivery Address</div>
                        <div className="small text-muted">
                          {o.address?.name || ""},{" "}
                          {o.address?.house || o.address?.line1 || ""}
                          {o.address?.city ? ", " + o.address.city : ""}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">Total</div>
                        <div className="small text-muted">
                          ₹{Number(o.amount || o.total || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
}

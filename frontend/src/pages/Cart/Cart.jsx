import React, { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Form,
  InputGroup,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { StoreContext } from "../../components/context/StoreContext";
import "./Cart.css";

const formatCurrency = (v) => `₹${Number(v).toFixed(2)}`;

export default function CartPage() {
  const ctx = useContext(StoreContext);
  const navigate = useNavigate();
  const itemsList = useMemo(() => ctx?.foodItems ?? [], [ctx]);
  const {
    cart: ctxCart = {},
    setItemQty,
    clearItem,
  } = useContext(StoreContext);

  const cartItems = useMemo(() => {
    return Object.entries(ctxCart)
      .map(([id, qty]) => {
        const it = itemsList.find((f) => String(f.id) === String(id));
        return it ? { ...it, qty } : null;
      })
      .filter(Boolean);
  }, [ctxCart, itemsList]);

  const itemsSubtotal = useMemo(() => {
    return cartItems.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
  }, [cartItems]);

  const discount = 0;

  const deliveryFee = useMemo(
    () => (itemsSubtotal > 0 ? 40 : 0),
    [itemsSubtotal],
  );

  const taxes = useMemo(() => itemsSubtotal * 0.05, [itemsSubtotal]);

  const total = useMemo(
    () => itemsSubtotal + deliveryFee + taxes - discount,
    [itemsSubtotal, deliveryFee, taxes, discount],
  );

  const setQty = (id, qty) => {
    const q = Math.max(1, Math.min(99, Number(qty) || 1));
    setItemQty(id, q);
  };

  const removeItem = (id) => {
    clearItem(id);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/placeorder");
  };

  return (
    <Container className="py-5 cart-page">
      <h3 className="mb-4">Your Order</h3>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Card body className="text-center">
              Your cart is empty.
            </Card>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((it) => (
                <ListGroup.Item key={it.id} className="cart-item">
                  <Row className="align-items-center">
                    <Col xs={3} sm={2} className="pe-0">
                      <Image src={it.image} rounded fluid loading="lazy" />
                    </Col>
                    <Col xs={9} sm={6}>
                      <div className="cart-item-name fw-bold mb-1">
                        {it.name}
                      </div>
                      <div className="cart-restaurant mb-1">
                        <strong>Restaurant:</strong> {it.restaurant}
                      </div>
                      <div className="cart-rating mb-2">
                        <strong>Rating:</strong> {it.rating} ⭐
                      </div>
                      <div className="cart-price text-success fw-bold">
                        {formatCurrency(it.price)}
                      </div>
                    </Col>
                    <Col xs={12} sm={4} className="text-sm-end mt-3 mt-sm-0">
                      <div className="d-flex align-items-center justify-content-sm-end gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => setQty(it.id, it.qty - 1)}
                        >
                          -
                        </Button>
                        <Form.Control
                          style={{ width: 68, textAlign: "center" }}
                          value={it.qty}
                          onChange={(e) =>
                            setQty(it.id, Number(e.target.value))
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => setQty(it.id, it.qty + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="mt-2 small">
                        Subtotal:{" "}
                        <span className="fw-bold">
                          {formatCurrency((it.price || 0) * it.qty)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(it.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between">
                <div>Items</div>
                <div>{formatCurrency(itemsSubtotal)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Discount</div>
                <div className="text-danger">-{formatCurrency(discount)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Delivery fee</div>
                <div>{formatCurrency(deliveryFee)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Taxes</div>
                <div>{formatCurrency(taxes)}</div>
              </div>

              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <div>Total</div>
                <div>{formatCurrency(total)}</div>
              </div>

              <div className="mt-3" />

              <Button
                className="w-100 mt-3"
                variant="success"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h6>Price breakdown</h6>
              <div className="small text-muted">
                Items: {formatCurrency(itemsSubtotal)}
              </div>
              <div className="small text-muted">
                Discount: -{formatCurrency(discount)}
              </div>
              <div className="small text-muted">
                Delivery: {formatCurrency(deliveryFee)}
              </div>
              <div className="small text-muted">
                Taxes & charges: {formatCurrency(taxes)}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

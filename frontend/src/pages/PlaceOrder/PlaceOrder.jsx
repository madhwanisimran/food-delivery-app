import React, { useContext, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";
import "./PlaceOrder.css";
import { toast } from "react-toastify";
import orderService from "../../services/orderService";
import authService from "../../services/authService";

const formatCurrency = (v) => `₹${Number(v).toFixed(2)}`;

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { foodItems = [], cart = {}, setCart } = useContext(StoreContext);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const it = foodItems.find((f) => String(f.id) === String(id));
          return it ? { ...it, qty } : null;
        })
        .filter(Boolean),
    [cart, foodItems]
  );

  const itemsSubtotal = useMemo(
    () => cartItems.reduce((s, it) => s + (it.price || 0) * it.qty, 0),
    [cartItems]
  );
  const deliveryFee = itemsSubtotal > 0 ? 40 : 0;
  const taxes = itemsSubtotal * 0.05;
  const total = itemsSubtotal + deliveryFee + taxes;

  // Billing form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Payment method state
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showUpiPayment, setShowUpiPayment] = useState(false);

  // Card payment state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI payment state
  const [upiId, setUpiId] = useState("");

  const validateBilling = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!/^[0-9]{10,}$/.test(phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (
      !street.trim() ||
      !city.trim() ||
      !stateVal.trim() ||
      !postalCode.trim()
    ) {
      toast.error("Please fill in all address fields");
      return false;
    }
    if (!country.trim()) {
      toast.error("Country is required");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateBilling()) return;
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowPaymentSelector(true);
  };

  const selectPaymentMethod = (method) => {
    setShowPaymentSelector(false);
    if (method === "card") {
      setShowCardPayment(true);
    } else if (method === "upi") {
      setShowUpiPayment(true);
    } else if (method === "cod") {
      processPayment(method);
    }
  };

  const processPayment = async (method) => {
    if (!authService.isLoggedIn()) {
      toast.error("Please log in to continue");
      return;
    }

    try {
      toast.info(`Processing ${method.toUpperCase()} payment...`);

      const orderPayload = {
        items: cartItems.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.qty,
        })),
        amount: total,
        address: {
          firstName,
          lastName,
          email,
          phone,
          street,
          city,
          state: stateVal,
          postalCode,
          country,
        },
        paymentMethod: method,
      };

      const res = await orderService.placeOrder(orderPayload);
      if (res?.success && res?.orderId) {
        if (method === "cod") {
          toast.success("Order placed successfully!");
          setShowCardPayment(false);
          setShowUpiPayment(false);
          setCart({});
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setStreet("");
          setCity("");
          setStateVal("");
          setPostalCode("");
          setCountry("");
          setCardName("");
          setCardNumber("");
          setCardExpiry("");
          setCardCvv("");
          setUpiId("");
          navigate(`/verify?orderId=${res.orderId}&success=false`);
          return;
        }
        const verifyRes = await orderService.verifyOrder(res.orderId, true);
        if (verifyRes?.success && verifyRes?.message === "paid") {
          toast.success("Payment successful! Order confirmed.");
          setShowCardPayment(false);
          setShowUpiPayment(false);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setStreet("");
          setCity("");
          setStateVal("");
          setPostalCode("");
          setCountry("");
          setCardName("");
          setCardNumber("");
          setCardExpiry("");
          setCardCvv("");
          setUpiId("");
          navigate(`/verify?orderId=${res.orderId}&success=true`);
        } else {
          toast.error(verifyRes?.message || "Payment verification failed");
        }
      } else {
        toast.error(res?.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed");
    }
  };

  const handleCardPayment = () => {
    if (
      !cardName.trim() ||
      !cardNumber.trim() ||
      !cardExpiry.trim() ||
      !cardCvv.trim()
    ) {
      toast.error("Please fill in all card details");
      return;
    }
    processPayment("card");
  };

  const handleUpiPayment = () => {
    if (!upiId.trim()) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    processPayment("upi");
  };

  return (
    <Container className="placeorder">
      <div className="placeorder-main">
        <div className="placeorder-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <div className="multi-fields">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="Zip code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="placeorder-right">
          <div className="cartitems">
            <h3>Cart Totals</h3>
            <div>
              <div className="cartitems-total-details">
                <p>Subtotal</p>
                <p>{formatCurrency(itemsSubtotal)}</p>
              </div>
              <hr />
              <div className="cartitems-total-details">
                <p>Delivery Fee</p>
                <p>
                  {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
                </p>
              </div>
              <hr />
              <div className="cartitems-total-details">
                <p>Taxes</p>
                <p>{formatCurrency(taxes)}</p>
              </div>
              <hr />
              <div className="cartitems-total-details">
                <b>Total</b>
                <b>{formatCurrency(total)}</b>
              </div>
            </div>
            <button onClick={handleProceedToPayment}>PROCEED TO PAYMENT</button>
          </div>
        </div>
      </div>

      <Modal
        show={showPaymentSelector}
        onHide={() => setShowPaymentSelector(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="payment-options">
            <Button
              variant="outline-dark"
              className="w-100 mb-2"
              onClick={() => selectPaymentMethod("card")}
            >
              💳 Credit/Debit Card
            </Button>
            <Button
              variant="outline-dark"
              className="w-100 mb-2"
              onClick={() => selectPaymentMethod("upi")}
            >
              📱 UPI
            </Button>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => selectPaymentMethod("cod")}
            >
              🏠 Cash on Delivery
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showCardPayment} onHide={() => setShowCardPayment(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Card Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength="16"
              />
            </Form.Group>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength="3"
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCardPayment(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleCardPayment}>
            Pay {formatCurrency(total)}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpiPayment} onHide={() => setShowUpiPayment(false)}>
        <Modal.Header closeButton>
          <Modal.Title>UPI Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>UPI ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpiPayment(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleUpiPayment}>
            Pay {formatCurrency(total)}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

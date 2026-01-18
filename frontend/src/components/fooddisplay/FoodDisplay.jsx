import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import "./FoodDisplay.css";
const FoodDisplay = ({ category = "All" }) => {
  const context = useContext(StoreContext);
  const navigate = useNavigate();

  const foodItems = useMemo(
    () =>
      context && Array.isArray(context.foodItems) ? context.foodItems : [],
    [context],
  );

  const filteredItems = useMemo(() => {
    if (!category || category === "All") return foodItems;
    return foodItems.filter(
      (it) =>
        String(it.category).toLowerCase() === String(category).toLowerCase(),
    );
  }, [foodItems, category]);

  const { user } = useContext(AuthContext);
  const isLoggedIn = Boolean(user);

  if (!context) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h4>Top Dishes Near You</h4>
          <p className="text-muted">
            Data not available. Make sure the app is wrapped with the
            StoreContext provider.
          </p>
        </div>
      </Container>
    );
  }

  const {
    cart = {},
    addToCart,
    removeFromCart,
    refreshFoods,
    loadingFoods,
  } = context;

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4>Top Dishes Near You</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={refreshFoods}
          disabled={loadingFoods}
        >
          {loadingFoods ? "Refreshing..." : "🔄 Refresh"}
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No items found for "{category}".</p>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reset
          </Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredItems.map((item) => (
            <Col key={item.id} className="container-card ">
              <Card className="h-100 border-0 shadow-sm">
                <div style={{ position: "relative" }}>
                  <Card.Img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{ height: 180, objectFit: "cover" }}
                  />
                  <Badge
                    bg="light"
                    text="dark"
                    style={{ position: "absolute", left: 12, top: 12 }}
                  >
                    {item.rating} ⭐
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="food-card-title mb-2">
                    {item.name}
                  </Card.Title>

                  <div className="food-restaurant mb-2">
                    <strong>Restaurant:</strong> {item.restaurant}
                  </div>

                  <Card.Text className="food-description mb-3">
                    <strong>Description:</strong> {item.description}
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div className="food-price">
                      <strong>₹{item.price}</strong>
                    </div>
                    <div className="food-rating">
                      <strong>Rating: {item.rating} ⭐</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center">
                    {cart[item.id] ? (
                      <div
                        className="d-flex align-items-center border rounded"
                        style={{ overflow: "hidden" }}
                      >
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => isLoggedIn && removeFromCart(item.id)}
                          disabled={!isLoggedIn}
                          style={{ padding: "6px 10px" }}
                        >
                          -
                        </Button>
                        <div className="cart-count">{cart[item.id]}</div>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => isLoggedIn && addToCart(item.id)}
                          disabled={!isLoggedIn}
                          style={{ padding: "6px 10px" }}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="add"
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          if (!isLoggedIn) return;
                          addToCart(item.id);
                          navigate("/cart");
                        }}
                        disabled={!isLoggedIn}
                      >
                        Add
                      </Button>
                    )}

                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        if (!isLoggedIn) return;
                        addToCart(item.id);
                        navigate("/cart");
                      }}
                      disabled={!isLoggedIn}
                    >
                      Order Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FoodDisplay;

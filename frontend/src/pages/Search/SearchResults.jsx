import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useContext } from "react";
import { StoreContext } from "../../components/context/StoreContext";
import { AuthContext } from "../../components/context/AuthContext";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const cuisine = params.get("c") || "";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 0);
  const {
    foodItems = [],
    addToCart,
    refreshFoods,
    loadingFoods,
  } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const isLoggedIn = Boolean(user);

  const filtered = useMemo(() => {
    return foodItems.filter((f) => {
      if (
        q &&
        !(f.name || "").toLowerCase().includes(q.toLowerCase()) &&
        !(f.restaurant || "").toLowerCase().includes(q.toLowerCase())
      )
        return false;
      if (
        cuisine &&
        !(f.category || "").toLowerCase().includes(cuisine.toLowerCase())
      )
        return false;
      if (minPrice && (f.price || 0) < minPrice) return false;
      if (maxPrice && (f.price || 0) > maxPrice) return false;
      return true;
    });
  }, [foodItems, q, cuisine, minPrice, maxPrice]);

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3>Search results{q ? ` for "${q}"` : ""}</h3>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={refreshFoods}
          disabled={loadingFoods}
        >
          {loadingFoods ? "Refreshing..." : "🔄 Refresh"}
        </Button>
      </div>
      <Row xs={1} md={2} lg={3} className="g-3">
        {filtered.map((it) => (
          <Col key={it.id}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">{it.name}</div>
                    <div className="small text-muted">{it.restaurant}</div>
                    <div className="small text-muted">{it.rating} ⭐</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">
                      ₹{Number(it.price).toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      className="mt-2"
                      variant="success"
                      onClick={() => isLoggedIn && addToCart(it.id)}
                      disabled={!isLoggedIn}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {filtered.length === 0 && (
        <div className="text-muted mt-3">No results</div>
      )}
    </Container>
  );
}

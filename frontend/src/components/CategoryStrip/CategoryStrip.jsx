import React, { useRef } from "react";
import { Container, Placeholder } from "react-bootstrap";
import './CategoryStrip.css'
import { Link } from "react-router-dom";
import Biryani from "../../assets/Category-items/biryani.jpg"
import Pizza from '../../assets/Category-items/pizza.jpg'
import CholeBhature from '../../assets/Category-items/chole bhature.jpg'
import Cakes from '../../assets/Category-items/cakes.jpg'
import Parathas from '../../assets/Category-items/parathas.jpg';
import Burgers from '../../assets/Category-items/burgers.jpg'
import Rolls from '../../assets/Category-items/rolls.jpg'
import Chinese from '../../assets/Category-items/chinese.jpg'
import Desserts from '../../assets/Category-items/dessert.jpg'
import Beverages from '../../assets/Category-items/shakes.jpg'
import SouthIndian from '../../assets/Category-items/south indian.jpg'
import Snacks from '../../assets/Category-items/snacks.jpg'
import Momos from '../../assets/Category-items/momos.jpg'
import Pasta from '../../assets/Category-items/pasta.jpg'
import PavBhaji from '../../assets/Category-items/pavbhaji.jpg'

const categories = [
  { id: 1, name: "Biryani", img: Biryani },
  { id: 2, name: "Pizzas", img: Pizza},
  { id: 3, name: "Chole Bhature", img: CholeBhature },
  { id: 4, name: "Cakes", img: Cakes },
  { id: 5, name: "Paratha", img: Parathas },
  { id: 6, name: "Burgers", img: Burgers },
  { id: 7, name: "Rolls", img: Rolls },
  { id: 8, name: "Desserts", img: Desserts },
  { id: 9, name: "Chinese", img:Chinese  },
  { id:10, name: "South Indian", img: SouthIndian },
  { id:11, name: "Beverages", img: Beverages },
  { id:12, name: "Snacks", img: Snacks },
  { id:13, name: "Momos", img: Momos },
  { id:14, name: "Pasta", img: Pasta },
  { id:15, name: "Pav Bhaji", img: PavBhaji },
];

export default function CategoryStrip({category, setCategory}) {
  const scrollerRef = useRef(null);

  const scrollBy = (dir = "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const item = el.querySelector(".cat-item");
    const cardWidth = item ? item.clientWidth : 120;
    const gap = 20;
    const amount = (cardWidth + gap) * 3;
    el.scrollTo({ left: dir === "right" ? el.scrollLeft + amount : el.scrollLeft - amount, behavior: "smooth" });
  };

  return (
    <Container className="category-section">
      <div className="section-header d-flex align-items-center justify-content-between">
        <h3>Explore Our Menu</h3>
        <div className="nav-arrows">
          <button className="arrow-btn" onClick={() => scrollBy("left")} aria-label="Prev">‹</button>
          <button className="arrow-btn" onClick={() => scrollBy("right")} aria-label="Next">›</button>
        </div>
      </div>

      <div className="category-scroller" ref={scrollerRef}>
        {categories.map((c) => (
          <div key={c.id} className="cat-item">
            <div onClick={() => setCategory(prev => prev === c.name ? "All" : c.name)} key={c.id} className="cat-thumb-wrap">
              <img src={c.img || Placeholder} alt={c.name} className={`${category === c.name ? "active" : ""} cat-thumb`}loading="lazy" />
            </div>
            <div className="cat-name">{c.name}</div>
          </div>
        ))}
      </div>
       <hr className="category-divider" />
    </Container>
  );
}

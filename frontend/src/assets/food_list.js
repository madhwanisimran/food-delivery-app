import biryani from "../assets/food-items/biryani.jpg";
import pizzas from "../assets/food-items/pizza.jpg";
import northIndian from "../assets/food-items/paneer-butter-masala.jpg";
import cakes from "../assets/food-items/chocolate-cake.jpg";
import paratha from "../assets/food-items/aloo-paratha.jpg";
import burgers from "../assets/food-items/cheese-burger.jpg";
import rolls from "../assets/food-items/kathi roll.jpg";
import desserts from "../assets/food-items/gulab jamun.jpg";
import chinese from "../assets/food-items/hakka noodels.jpg";
import southIndian from "../assets/food-items/masala-dosa.jpg";
import beverages from "../assets/food-items/cold coffee.jpg";
import snacks from "../assets/food-items/samosa.jpg";

// import placeholder from "../assets/categories/placeholder.png";

export const foodItems = [
  {
    id: 1,
    name: "Hyderabadi Chicken Biryani",
    category: "Biryani",
    price: 220,
    rating: 4.5,
    image: biryani,
    restaurant: "Paradise Biryani",
    description: "Long-grained rice cooked with tender chicken and spices.",
  },
  {
    id: 2,
    name: "Veg Supreme Pizza",
    category: "Pizzas",
    price: 299,
    rating: 4.2,
    image: pizzas,
    restaurant: "Domino’s",
    description: "Loaded with cheese, veggies and Italian herbs.",
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    category: "North Indian",
    price: 180,
    rating: 4.6,
    image: northIndian,
    restaurant: "Punjabi Rasoi",
    description: "Creamy and flavorful curry with tender paneer cubes.",
  },
  {
    id: 4,
    name: "Chocolate Truffle Cake",
    category: "Cakes",
    price: 450,
    rating: 4.9,
    image: cakes,
    restaurant: "CakeZone",
    description: "Rich chocolate cake layered with smooth ganache.",
  },
  {
    id: 5,
    name: "Aloo Paratha with Butter",
    category: "Paratha",
    price: 99,
    rating: 4.3,
    image: paratha,
    restaurant: "Giani’s Dhaba",
    description: "Stuffed wheat flatbread served with butter and pickle.",
  },
  {
    id: 6,
    name: "Cheese Burger",
    category: "Burgers",
    price: 160,
    rating: 4.1,
    image: burgers,
    restaurant: "Burger King",
    description: "Grilled patty layered with cheese, lettuce and sauces.",
  },
  {
    id: 7,
    name: "Kathi Roll",
    category: "Rolls",
    price: 150,
    rating: 4.4,
    image: rolls,
    restaurant: "Rolls King",
    description: "Soft paratha roll stuffed with spicy fillings.",
  },
  {
    id: 8,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 80,
    rating: 4.8,
    image: desserts,
    restaurant: "Haldiram’s",
    description: "Soft fried milk balls soaked in sugar syrup.",
  },
  {
    id: 9,
    name: "Hakka Noodles",
    category: "Chinese",
    price: 130,
    rating: 4.2,
    image: chinese,
    restaurant: "China Town",
    description: "Stir-fried noodles with vegetables and sauces.",
  },
  {
    id: 10,
    name: "Masala Dosa",
    category: "South Indian",
    price: 110,
    rating: 4.6,
    image: southIndian,
    restaurant: "Udupi Café",
    description: "Crispy dosa filled with potato masala served with chutney.",
  },
  {
    id: 11,
    name: "Cold Coffee",
    category: "Beverages",
    price: 90,
    rating: 4.0,
    image: beverages,
    restaurant: "Café Coffee Day",
    description: "Chilled blend of coffee, milk, and ice cream.",
  },
  {
    id: 12,
    name: "Samosa",
    category: "Snacks",
    price: 30,
    rating: 4.5,
    image: snacks,
    restaurant: "Street Eats",
    description: "Crispy fried pastry with spicy potato filling.",
  },
];

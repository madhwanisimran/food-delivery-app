import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import foodService from "../../services/foodService";
import cartService from "../../services/cartService";
import authService from "../../services/authService";
import { toast } from "react-toastify";

const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // cart: { [itemId]: count }
  const [cart, setCart] = useState({});
  const [foodItems, setFoodItems] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const fetchFoods = useCallback(async () => {
    setLoadingFoods(true);
    const res = await foodService.getFoods();
    if (res.success) {
      setFoodItems(res.foods);
    } else {
      console.warn("Failed to fetch foods:", res.message);
    }
    setLoadingFoods(false);
  }, []);

  // Fetch cart from backend if user is logged in
  const fetchCart = useCallback(async () => {
    const isLoggedIn = authService.isLoggedIn();
    if (!isLoggedIn) {
      setCart({});
      return;
    }
    setLoadingCart(true);
    const res = await cartService.getCart();
    if (res.success) {
      setCart(res.cartData || {});
    } else {
      console.warn("Failed to fetch cart:", res.message);
      setCart({});
    }
    setLoadingCart(false);
  }, []);

  useEffect(() => {
    fetchFoods();
    fetchCart();
  }, [fetchFoods, fetchCart]);

  const addToCart = useCallback(async (id) => {
    const isLoggedIn = authService.isLoggedIn();
    if (!isLoggedIn) {
      toast.info("Please sign in to add items to your cart");
      return;
    }
    const res = await cartService.addToCart(id);
    if (res.success) {
      setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    } else {
      console.error("Failed to add to cart:", res.message);
    }
  }, []);

  const removeFromCart = useCallback(async (id) => {
    const isLoggedIn = authService.isLoggedIn();
    if (!isLoggedIn) {
      toast.info("Please sign in to modify your cart");
      return;
    }
    const res = await cartService.removeFromCart(id);
    if (res.success) {
      setCart((prev) => {
        const current = prev[id] || 0;
        if (current <= 1) {
          const { [id]: _omit, ...rest } = prev;
          return rest;
        }
        return { ...prev, [id]: current - 1 };
      });
    } else {
      console.error("Failed to remove from cart:", res.message);
    }
  }, []);

  const setItemQty = useCallback(
    async (id, qty) => {
      const isLoggedIn = authService.isLoggedIn();
      const q = Math.max(0, Number(qty) || 0);
      if (!isLoggedIn) {
        toast.info("Please sign in to modify your cart");
        return;
      }
      await fetchCart();
    },
    [fetchCart]
  );

  const clearItem = useCallback(
    async (id) => {
      const isLoggedIn = authService.isLoggedIn();
      if (!isLoggedIn) {
        toast.info("Please sign in to modify your cart");
        return;
      }
      await cartService.removeFromCart(id);
      await fetchCart();
    },
    [fetchCart]
  );

  const contextValue = useMemo(
    () => ({
      foodItems,
      loadingFoods,
      refreshFoods: fetchFoods,
      cart,
      loadingCart,
      refreshCart: fetchCart,
      addToCart,
      removeFromCart,
      setItemQty,
      clearItem,
      setCart,
    }),
    [
      foodItems,
      loadingFoods,
      cart,
      loadingCart,
      fetchFoods,
      fetchCart,
      addToCart,
      removeFromCart,
      setItemQty,
      clearItem,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export { StoreContext };
export default StoreContextProvider;

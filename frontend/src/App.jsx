import React, { useContext } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/header/NavBar.jsx";
import { AuthContext } from "./components/context/AuthContext.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Verify from "./pages/Verify/Verify.jsx";
import SearchResults from "./pages/Search/SearchResults.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    toast.success("Welcome!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="App">
        <ToastContainer />
        <NavBar
          user={user}
          onLogout={handleLogout}
          onAuthSuccess={handleAuthSuccess}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/placeorder"
            element={
              <RequireAuth>
                <PlaceOrder />
              </RequireAuth>
            }
          />
          <Route
            path="/order"
            element={
              <RequireAuth>
                <PlaceOrder />
              </RequireAuth>
            }
          />
          <Route path="/verify" element={<Verify />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default App;

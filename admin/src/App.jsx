import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/OrdersAdmin.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./index.css";
import AdminLogin from "./pages/AdminLogin.jsx";

export const API_URL = "http://localhost:4000/api";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/login" element={<AdminLogin url={API_URL} />} />
          <Route path="/" element={<Orders url={API_URL} />} />
          <Route path="/add" element={<Add url={API_URL} />} />
          <Route path="/list" element={<List url={API_URL} />} />
          <Route path="/orders" element={<Orders url={API_URL} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

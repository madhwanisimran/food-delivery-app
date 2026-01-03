import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import adminAuthService from "../services/adminAuthService";
import "../styles/OrdersAdmin.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const token = adminAuthService.getToken();
      const res = await orderService.listOrders(token);
      if (res.success && res.orders) {
        setOrders(res.orders);
      } else {
        const msg = res.message || "Failed to load orders";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      const msg =
        err.response?.data?.message || "Network error while fetching orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminAuthService.isLoggedIn()) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [fetchOrders, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        toast.success("Order status updated successfully");
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update order status", err);
      toast.error("Error updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => fetchOrders();

  return (
    <div className="orders-page p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">All Orders</h5>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            className="me-2"
          >
            Refresh
          </Button>
        </div>
      </div>

      {!loading && orders.length === 0 && !error && (
        <p className="text-muted">No orders found</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle table-clean"
          >
            <thead className="table">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="table-row">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id.substring(0, 8)}...</td>
                  <td>{order.userId?.name || "Unknown"}</td>
                  <td className="text" style={{ maxWidth: 200 }}>
                    {order.userId?.email || "N/A"}
                  </td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.items?.map((it, idx) => (
                        <li key={idx} style={{ fontSize: 13 }}>
                          {it.name} x{it.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.amount}</td>
                  <td>
                    <select
                      value={order.orderStatus || "food processing"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                      className="form-select form-select-sm"
                      style={{ fontSize: 13 }}
                    >
                      <option value="food processing">Food Processing</option>
                      <option value="out for delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <Badge bg={order.payment ? "success" : "danger"}>
                      {order.payment ? "Paid" : "Pending"}
                    </Badge>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Orders;

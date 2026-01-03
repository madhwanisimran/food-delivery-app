import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import api from "../services/axiosInstance";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import { X } from "react-bootstrap-icons";
import "../styles/List.css";

const List = ({ url }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/food/list`);
      if (data && data.success) setItems(data.foods || []);
      else toast.error(data?.message || "Failed to load items");
    } catch (err) {
      console.error("Failed to fetch items", err);
      toast.error("Network error while fetching items");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const { data } = await api.post(`/food/remove`, { id });
      if (data && data.success) {
        toast.success("Item removed");
        fetchItems();
      } else toast.error(data?.message || "Failed to remove item");
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Network error while deleting item");
    }
  };

  if (loading) return <div className="list-page">Loading...</div>;

  return (
    <div className="list-page">
      <h5>All Foods List</h5>

      <div className="table-responsive">
        <Table bordered hover className="foods-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = item._id || item.id;
              const imgSrc = item.image
                ? `${url.replace("/api", "")}/uploads/${item.image}`
                : item.img || null;
              return (
                <tr key={id}>
                  <td style={{ width: 140 }}>
                    <div className="thumb">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} />
                      ) : (
                        <div className="placeholder-thumb" />
                      )}
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹ {item.price}</td>
                  <td>
                    <button
                      className="action-delete"
                      onClick={() => handleDelete(id)}
                    >
                      <X />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default List;

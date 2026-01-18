import React, { useState, useRef } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Upload, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import api from "../services/axiosInstance";
import "../styles/Add.css";

const Add = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Biryani");
  const [price, setPrice] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [rating, setRating] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const inputRef = useRef(null);

  function handleUpload(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleRemoveImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !name.trim() ||
      !description.trim() ||
      price === "" ||
      !restaurantName.trim()
    ) {
      toast.error("Please fill the required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("price", Number(price));
    formData.append("restaurantName", restaurantName.trim());
    if (rating) {
      formData.append("rating", Number(rating));
    }
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await api.post(`/food/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.data?.success) {
        toast.success("Product added successfully");
        setName("");
        setDescription("");
        setCategory("Biryani");
        setPrice("");
        setRestaurantName("");
        setRating("");
        handleRemoveImage();
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  }

  return (
    <div className="add">
      <h4>Upload Image</h4>
      <div className="upload-row">
        <div className="upload-box">
          {preview ? (
            <div className="preview-wrap">
              <img src={preview} alt="preview" className="upload-img-preview" />
              <div className="preview-actions">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => inputRef.current && inputRef.current.click()}
                >
                  Change
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="ms-2"
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ) : (
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-placeholder">
                <Upload size={36} />
                <div className="upload-text">
                  Click to upload or drag and drop
                </div>
              </div>
              <input
                id="file-input"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                hidden
              />
            </label>
          )}
        </div>
      </div>

      <Form className="add-form" onSubmit={handleSubmit}>
        <Form.Group className="product-name mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Type here"
            required
          />
        </Form.Group>
        <Form.Group className="product-description mb-3">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            as="textarea"
            rows={4}
            placeholder="Write Content here"
            required
          />
        </Form.Group>
        <Row className="restaurant-rating mb-3">
          <Col md={6} className="restaurant-name">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              type="text"
              placeholder="Enter restaurant name"
              required
            />
          </Col>
          <Col md={6} className="product-rating">
            <Form.Label>Rating (1-5)</Form.Label>
            <Form.Control
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="4.5"
            />
          </Col>
        </Row>
        <Row className="product-category-price mb-3">
          <Col className="product-category" md={4}>
            <Form.Label>Product Category</Form.Label>
            <Form.Select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Biryani">Biryani</option>
              <option value="Rolls">Rolls</option>
              <option value="North-Indian">North Indian</option>
              <option value="South-Indian">South Indian</option>
              <option value="Beverages">Beverages</option>
              <option value="Cakes">Cakes</option>
              <option value="Desserts">Desserts</option>
              <option value="Chinese">Chinese</option>
              <option value="Snacks">Snacks</option>
              <option value="Pizzas">Pizzas</option>
              <option value="Burgers">Burgers</option>
              <option value="Paratha">Paratha</option>
              <option value="Paneer">Paneer</option>
            </Form.Select>
          </Col>
          <Col md={3} className="product-price">
            <Form.Label>Product price</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <FormControl
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                required
              />
            </InputGroup>
          </Col>
        </Row>
        <Button variant="dark" type="submit" className="add-btn">
          ADD
        </Button>
      </Form>
    </div>
  );
};

export default Add;

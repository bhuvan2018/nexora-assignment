import { formatINR } from "../utils/format";
import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from "../services/api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAddToCart(productId) {
    try {
      setAdding(productId);
      await addToCart(productId, 1);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setMessage("Error adding to cart");
    } finally {
      setAdding(null);
    }
  }

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="products-page">
      <h2>Products</h2>
      {message && <div className="message">{message}</div>}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="price">{formatINR(p.price)}</p>
              {p.description && <p className="desc">{p.description}</p>}
            </div>
            <button
              className="add-btn"
              onClick={() => handleAddToCart(p.id)}
              disabled={adding === p.id}
            >
              {adding === p.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
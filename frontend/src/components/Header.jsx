import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../services/api";
import "./Header.css";

export default function Header() {
  const [count, setCount] = useState(0);

  async function loadCount() {
    try {
      const data = await getCart();
      setCount(data.items ? data.items.length : 0);
    } catch (err) {
        console.error("Failed to load cart count:", err.message || err);
    }
  }

  useEffect(() => {
    loadCount();
    const t = setInterval(loadCount, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="header">
      <nav>
        <h1 className="logo">Vibe Commerce</h1>
        <ul className="nav-links">
          <li><Link to="/">Products</Link></li>
          <li>
            <Link to="/cart">Cart {count > 0 && <span className="badge">{count}</span>}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
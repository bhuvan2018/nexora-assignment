import { formatINR } from "../utils/format";
import React, { useState } from "react";
import "./CartItem.css";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const [qty, setQty] = useState(item.qty);
  const [updating, setUpdating] = useState(false);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    if (val < 1) return;
    setQty(val);
  };

  const saveQty = async () => {
    if (qty === item.qty) return;
    try {
      setUpdating(true);
      await onUpdateQty(item.id, qty);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (e) => {
    if (!confirm("Remove this item from cart?")) return;
    const el = e.currentTarget.closest(".cart-item");
    if (el) {
      el.classList.add("removing");
      setTimeout(() => onRemove(item.id), 260);
    } else {
      await onRemove(item.id);
    }
  };

  return (
    <div className="cart-item">
      <div className="ci-left">
        <div className="ci-name">{item.product.name}</div>
        <div className="ci-price">{formatINR(item.product.price)}</div>
      </div>

      <div className="ci-controls">
        <input
          className="qty-input"
          type="number"
          min="1"
          value={qty}
          onChange={handleChange}
        />
        <button
          className="save-btn"
          onClick={saveQty}
          disabled={updating || qty === item.qty}
        >
          {updating ? "Saving..." : "Save"}
        </button>
        <button className="remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>

      <div className="ci-line-total">
        {formatINR(item.product.price * item.qty)}
      </div>
    </div>
  );
}
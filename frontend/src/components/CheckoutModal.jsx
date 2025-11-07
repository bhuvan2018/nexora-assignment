import { formatINR } from "../utils/format";
import React, { useState } from "react";
import { checkout } from "../services/api";
import "./CheckoutModal.css";

export default function CheckoutModal({ items, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Name and email are required");
      return;
    }

    const cartItems = items.map((it) => ({
      productId: it.product.id,
      qty: it.qty
    }));

    try {
      setSubmitting(true);
      const data = await checkout(cartItems, name, email);
      setReceipt(data);
      setSubmitting(false);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error("Checkout failed", err);
      setError(err?.response?.data?.error || "Checkout failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Checkout</h3>

        {!receipt ? (
          <>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="summary">
                <strong>Order summary</strong>
                <ul>
                  {items.map((it) => (
                    <li key={it.id}>
                        {it.product.name} x {it.qty} — {formatINR(it.product.price * it.qty)}
                    </li>
                  ))}
                </ul>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="modal-actions">
                <button type="submit" className="confirm-btn" disabled={submitting}>
                  {submitting ? "Processing..." : "Place Order"}
                </button>
                <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="receipt">
            <h4>Receipt</h4>
            <p><strong>Receipt ID:</strong> {receipt.receiptId}</p>
            <p><strong>Total:</strong> {formatINR(receipt.total)}</p>
            <p><strong>When:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>

            <div className="modal-actions">
              <button onClick={onClose} className="confirm-btn">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
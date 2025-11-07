import { formatINR } from "../utils/format";
import React, { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../services/api";
import CartItem from "../components/CartItem";
import CheckoutModal from "../components/CheckoutModal";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function loadCart() {
    try {
      setLoading(true);
      const data = await getCart();
      setCart({
        items: data.items || [],
        total: Number(data.total || 0)
      });
    } catch (err) {
      console.error("Failed to load cart", err);
      setMessage("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleUpdateQty(itemId, newQty) {
    try {
      await updateCartItem(itemId, newQty);
      await loadCart();
    } catch (err) {
      console.error("Update qty failed", err);
      setMessage("Failed to update quantity");
    }
  }

  async function handleRemove(itemId) {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      console.error("Remove failed", err);
      setMessage("Failed to remove item");
    }
  }

  function handleCheckoutSuccess(receipt) {
    setCheckoutOpen(false);
    setMessage("Order complete! Receipt ID: " + receipt.receiptId);
    loadCart();
    setTimeout(() => setMessage(""), 5000);
  }

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-page">
      <h2>Cart</h2>
      {message && <div className="message">{message}</div>}

      {cart.items.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map((it) => (
              <CartItem
                key={it.id}
                item={it}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <strong>Total:</strong> {formatINR(cart.total)}
            </div>
            <div className="cart-actions">
              <button className="checkout-btn" onClick={() => setCheckoutOpen(true)}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}

      {checkoutOpen && (
        <CheckoutModal
          items={cart.items}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
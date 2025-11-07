import axios from "axios";

const API_BASE = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
});

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function getCart() {
  const res = await api.get("/cart");
  return res.data;
}

export async function addToCart(productId, qty = 1) {
  const res = await api.post("/cart", { productId, qty });
  return res.data;
}

export async function removeCartItem(id) {
  const res = await api.delete(`/cart/${id}`);
  return res.data;
}

export async function updateCartItem(id, qty) {
  const res = await api.put(`/cart/${id}`, { qty });
  return res.data;
}

export async function checkout(cartItems, name, email) {
  const res = await api.post("/checkout", { cartItems, name, email });
  return res.data;
}
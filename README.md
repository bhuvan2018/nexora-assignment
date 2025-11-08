# Vibe E-Com – Full Stack Mock Cart

A simple full-stack shopping cart app built for the **Vibe Commerce Internship Task**.
Implements basic e-commerce functionality: product listing, cart management, and mock checkout using the **MERN stack**.

---

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | React (Vite) + Axios + React Router + Pure CSS |
| Backend  | Node.js + Express                              |
| Database | MongoDB Atlas                                  |
| API      | RESTful endpoints                              |

---

## Features

* View mock products
* Add / update / remove cart items
* View cart total
* Checkout with mock receipt
* Persistent data via MongoDB
* Responsive UI
---

## Preview

### 🛍️ Products
![Products](/assets/screenshots/s1.png)

### ➕ Added to Cart
![Added to Cart](/assets/screenshots/s2.png)

### 🧺 Cart Page
![Cart](/assets/screenshots/s3.png)

### 💳 Checkout Modal
![Checkout Modal](/assets/screenshots/s4.png)

### 🧾 Receipt
![Receipt](/assets/screenshots/s5.png)

### 🗄️ (Optional) MongoDB Atlas
![MongoDB Collection](/assets/screenshots/s6.png)
---

## Setup Instructions

### Clone the repo

```bash
git clone https://github.com/<your-username>/vibe-ecom.git
cd vibe-ecom
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=4000
```

Seed mock products:

```bash
npm run seed
```

Run server:

```bash
npm run dev
```

Server runs on **[http://localhost:4000](http://localhost:4000)**

---

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**

> Make sure your backend is running first.

---

## API Overview

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| GET    | `/api/products` | Fetch all products              |
| POST   | `/api/cart`     | Add to cart                     |
| GET    | `/api/cart`     | Get cart items + total          |
| PUT    | `/api/cart/:id` | Update item quantity            |
| DELETE | `/api/cart/:id` | Remove from cart                |
| POST   | `/api/checkout` | Mock checkout (returns receipt) |

---
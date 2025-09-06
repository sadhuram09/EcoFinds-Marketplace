# 🛍️ EcoFinds Marketplace

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)  
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss)  
![Fake Store API](https://img.shields.io/badge/API-Fake%20Store%20API-orange)  
![Status](https://img.shields.io/badge/Status-Demo%20Project-green)

EcoFinds Marketplace is a demo **e-commerce web application** built using the [Fake Store API](https://fakestoreapi.com/).  
It simulates a real-world online marketplace with features like **product browsing, user accounts, cart, orders, and listings**.

---

## ✨ Features

✅ **Authentication** – Login / Sign Up with email & password  
✅ **Product Feed** – Fetch & display products from Fake Store API  
✅ **Search & Filters** – Find products by keyword or category  
✅ **Add New Listing** – Users can add their own products  
✅ **My Listings** – Manage, edit, or delete user products  
✅ **Product Detail Page** – Large view with description & price  
✅ **User Dashboard** – Profile info with edit option  
✅ **Cart** – Add/remove products, view selected items  
✅ **Previous Purchases** – Order history for the logged-in user

---

## 🖼️ Wireframe to UI Flow

### 🔑 Login / Sign Up

- App logo
- Email & password input
- Login button + Sign Up link

### 🏬 Product Listing Feed

- Header with app title/logo
- Search bar & category filters
- Product cards (image, title, price)
- ➕ Floating button to add new product

### ➕ Add New Product

- Input fields: Title, Category (dropdown), Description, Price
- Upload image (placeholder)
- Submit button

### 📂 My Listings

- User-added products with Edit & Delete
- ➕ Add new product option

### 📖 Product Details

- Big product image
- Title, price, category, description

### 👤 User Dashboard

- Profile image + user info
- Editable fields

### 🛒 Cart

- All added products in card layout
- Info: image, title, price

### 📦 Previous Purchases

- List of past orders

---

## 🛠️ Tech Stack

| Layer                | Tech Used                                   |
| -------------------- | ------------------------------------------- |
| **Frontend**         | React + Vite                                |
| **Styling**          | Tailwind CSS                                |
| **API**              | [Fake Store API](https://fakestoreapi.com/) |
| **State Management** | Context API / Redux (optional)              |
| **Auth (demo)**      | Local form-based                            |

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/sadhuram09/EcoFinds-Marketplace.git

cd EcoFinds-Marketplace

# Install dependencies
npm install

# Start dev server
npm run dev
```

🚀 Future Roadmap

🔐 Real authentication with JWT & database

💳 Payment gateway integration

📱 Mobile-first responsive UI

🗂️ Advanced filters & recommendations

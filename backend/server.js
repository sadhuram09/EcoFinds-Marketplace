const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "mysecretkey123", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Base route
app.get("/", (req, res) => {
  res.send("EcoFinds Backend Running");
});

// User registration
app.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please enter email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, "mysecretkey123", { expiresIn: "1h" });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username;
    await user.save();

    res.json({ message: "Profile updated", username: user.username });
  } catch (error) {
    console.error("Profile update error", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Product CRUD APIs
app.post("/products", authenticateToken, async (req, res) => {
  try {
    const { title, description, category, price, image } = req.body;
    if (!title || !description || !category || price == null)
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });

    const product = new Product({
      title,
      description,
      category,
      price,
      image: image || "placeholder.jpg",
      userId: req.user.id,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get all products // Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, category, price, image } = req.body;
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price != null ? price : product.price;
    product.image = image || product.image;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cart APIs
//
app.post("/cart", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1)
      return res
        .status(400)
        .json({ message: "Product ID and valid quantity required" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/cart", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/cart/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );
    await cart.save();
    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//
// Order APIs
app.post("/orders", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalPrice = 0;
    const orderProducts = cart.products.map((item) => {
      totalPrice += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      };
    });

    const order = new Order({
      userId: req.user.id,
      products: orderProducts,
      totalPrice,
    });
    await order.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

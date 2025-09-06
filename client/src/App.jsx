import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from backend
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Categories - you can dynamically fetch later
  const categories = ["All", "Electronics", "Clothing", "Books", "Furniture"];

  // Filter products by search term and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <h1 style={{ textAlign: "center" }}>EcoFinds Marketplace</h1>

      {/* Search & Category */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", flex: "1" }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <Link
              to={`/product/${p._id}`}
              key={p._id}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                  transition: "transform 0.2s",
                }}
              >
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No products available.</p>
        )}
      </div>

      {/* Floating "+" Button to add product */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#27ae60",
          color: "white",
          fontSize: "32px",
          cursor: "pointer",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        +
      </button>
    </div>
  );
}

export default App;

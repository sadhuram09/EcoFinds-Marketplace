import { useState, useEffect } from "react";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const categories = ["Electronics", "Clothing", "Books", "Furniture"];

  // Fetch all products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, category, description, image }),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts([...products, newProduct]);
        setName("");
        setPrice("");
        setCategory("Electronics");
        setDescription("");
        setImage("");
        alert("Product added!");
      })
      .catch(() => alert("Failed to add product!"));
  };

  // Delete product
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" })
      .then(() => setProducts(products.filter((p) => p._id !== id)))
      .catch(() => alert("Delete failed!"));
  };

  // Edit product
  const handleEdit = (product) => {
    const newName = prompt("Enter new product name", product.name);
    const newPrice = prompt("Enter new price", product.price);
    if (!newName || !newPrice) return;

    fetch(`http://localhost:5000/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, price: newPrice }),
    })
      .then((res) => res.json())
      .then((updatedProduct) =>
        setProducts(
          products.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          )
        )
      )
      .catch(() => alert("Update failed!"));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      <h2 style={{ textAlign: "center" }}>Dashboard</h2>

      {/* Add Product Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Product Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", minHeight: "80px" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter image URL (placeholder for upload)");
            if (url) setImage(url);
          }}
          style={{
            padding: "10px",
            background: "#2980b9",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          + Add Image {image ? "(Added)" : ""}
        </button>
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#27ae60",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Listing
        </button>
      </form>

      {/* Product List */}
      <h3>Your Products</h3>
      {products.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((p) => (
            <li
              key={p._id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{p.name}</strong> — ₹{p.price}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    background: "#f39c12",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products yet.</p>
      )}
    </div>
  );
}

export default Dashboard;

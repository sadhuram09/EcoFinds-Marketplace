import { useEffect, useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from backend
    fetch("http://localhost:5000/cart") // adjust API endpoint
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const handleRemove = (id) => {
    fetch(`http://localhost:5000/cart/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setCartItems(cartItems.filter((item) => item._id !== id)))
      .catch(() => alert("Failed to remove item!"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>My Cart</h2>

      {cartItems.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <button
                onClick={() => handleRemove(item._id)}
                style={{
                  padding: "8px",
                  background: "#c0392b",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Your cart is empty.
        </p>
      )}
    </div>
  );
}

export default Cart;

import { useEffect, useState } from "react";

function PreviousPurchase() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Fetch previous purchases from backend
    fetch("http://localhost:5000/purchases") // adjust API endpoint
      .then((res) => res.json())
      .then((data) => setPurchases(data))
      .catch((err) => console.error("Error fetching purchases:", err));
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Previous Purchases</h2>

      {purchases.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {purchases.map((item) => (
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
              <p style={{ fontSize: "12px", color: "#555" }}>
                Purchased on: {new Date(item.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          You have no previous purchases.
        </p>
      )}
    </div>
  );
}

export default PreviousPurchase;

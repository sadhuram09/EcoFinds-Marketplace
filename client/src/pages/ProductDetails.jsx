import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>{product.name}</h2>
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        Price: ₹{product.price}
      </p>
      <p style={{ marginTop: "10px" }}>
        {product.description || "No description available."}
      </p>
    </div>
  );
}

export default ProductDetails;

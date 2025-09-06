import { useEffect, useState } from "react";

function UserDashboard() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    // Fetch user details from backend
    fetch("http://localhost:5000/users/me") // adjust API endpoint
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleUpdate = () => {
    fetch("http://localhost:5000/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then(() => alert("Profile updated!"))
      .catch(() => alert("Update failed!"));
  };

  return (
    <div
      style={{ maxWidth: "500px", margin: "30px auto", textAlign: "center" }}
    >
      <h2>User Dashboard</h2>

      <img
        src={user.image || "https://via.placeholder.com/120"}
        alt="Profile"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          marginBottom: "20px",
        }}
      />

      <input
        type="text"
        placeholder="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        style={{
          display: "block",
          padding: "10px",
          margin: "10px auto",
          width: "100%",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        style={{
          display: "block",
          padding: "10px",
          margin: "10px auto",
          width: "100%",
        }}
      />

      <input
        type="text"
        placeholder="Phone"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        style={{
          display: "block",
          padding: "10px",
          margin: "10px auto",
          width: "100%",
        }}
      />

      <input
        type="text"
        placeholder="Profile Image URL"
        value={user.image}
        onChange={(e) => setUser({ ...user, image: e.target.value })}
        style={{
          display: "block",
          padding: "10px",
          margin: "10px auto",
          width: "100%",
        }}
      />

      <button
        onClick={handleUpdate}
        style={{
          padding: "10px",
          background: "#27ae60",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px",
        }}
      >
        Update Profile
      </button>
    </div>
  );
}

export default UserDashboard;

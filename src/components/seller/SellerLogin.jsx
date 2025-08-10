import React, { useState } from "react";
import axios from "axios";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/login`,
        { email, password },
        {
          withCredentials: true, // important for cookie-based auth
        }
      );

      console.log("Login successful:", data);
      alert("Seller login successful!");
      // Redirect to seller dashboard
      window.location.href = "/seller-dashboard";

    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Seller Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "15px", padding: "8px 16px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;

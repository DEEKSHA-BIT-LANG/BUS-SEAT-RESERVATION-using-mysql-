// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
    if (!passwordPattern.test(password)) {
      alert(
        "Password must have uppercase, lowercase, number, special char, min 6 chars."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6A11CB, #2575FC)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "15px",
          width: "300px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <img src={Logo} alt="Bus Logo" style={{ width: "80px", marginBottom: "1rem" }} />

        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Signup</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.7rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.7rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <button
          onClick={handleSignup}
          style={{ width: "100%", padding: "0.7rem", backgroundColor: "#10B981", color: "white", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", marginBottom: "1rem" }}
        >
          Signup
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3B82F6", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

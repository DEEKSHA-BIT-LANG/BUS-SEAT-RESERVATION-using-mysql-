import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem 2rem",
      backgroundColor: "#1D4ED8",
      color: "white",
      fontWeight: "bold",
      alignItems: "center"
    }}>
      <div>BusBooking</div>
      <div>
        <Link to="/login" style={{ marginRight: "1rem", color: "white", textDecoration: "none" }}>Login</Link>
        <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
      </div>
    </nav>
  );
}

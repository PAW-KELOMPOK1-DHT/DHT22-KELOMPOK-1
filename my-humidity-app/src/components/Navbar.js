import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <h1>Humidity Monitoring</h1>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/sensors">Sensors</Link>
        <Link to="/sensor-data">Data</Link>
        <Link to="/users">Users</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

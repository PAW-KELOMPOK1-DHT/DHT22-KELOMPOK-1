import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Ambil role dari localStorage
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // hapus role juga
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #111;
          padding: 10px 20px;
          border-bottom: 2px solid #00f0ff;
        }
        .navbar h1 {
          color: #00f0ff;
          margin: 0;
          font-size: 1.5rem;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          transition: 0.3s;
        }
        .nav-links a:hover {
          background: #00f0ff;
          color: #111;
        }
        .nav-links a.active {
          background: #00c0cc;
          color: #111;
        }
        .nav-links button {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #ff4d4d;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .nav-links button:hover {
          background: #cc0000;
        }
      `}</style>

      <nav className="navbar">
        <h1>Humidity Monitoring</h1>
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/sensors">Sensors</NavLink>
          <NavLink to="/sensor-data">Data</NavLink>

          {/* Hanya tampilkan Users jika role admin */}
          {role === "admin" && <NavLink to="/users">Users</NavLink>}

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </>
  );
}

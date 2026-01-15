import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/sensors">Sensors</Link>
      <Link to="/sensor-data">Sensor Data</Link>
      <Link to="/users">Users</Link>
    </div>
  );
}

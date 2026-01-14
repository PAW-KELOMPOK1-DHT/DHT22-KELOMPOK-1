import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function SensorData() {
  const [data, setData] = useState([]);

  // Ambil role dari localStorage
  const role = localStorage.getItem("role"); // "admin" atau "user"
  const isAdmin = role === "admin";

  const fetchData = async () => {
    try {
      const res = await api.get("/sensor-data?limit=50");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return; // user biasa tidak bisa hapus
    if (window.confirm("Hapus data ini?")) {
      await api.delete(`/sensor-data/${id}`);
      fetchData();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      <h2>Sensor Data</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sensor</th>
            <th>Humidity</th>
            <th>Temperature</th>
            <th>Timestamp</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.sensor?.name}</td>
              <td>{d.humidity}</td>
              <td>{d.temperature}</td>
              <td>{new Date(d.timestamp).toLocaleString()}</td>
              {isAdmin && (
                <td>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    style={{ padding: "5px 10px", borderRadius: "5px", cursor: "pointer", background: "#ff4d4d", color: "#fff", border: "none" }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

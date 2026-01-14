import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

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
    <div style={{ fontFamily: "Roboto, sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Internal CSS */}
      <style>{`
        .sensor-data-container {
          padding: 20px;
        }
        h2 {
          text-align: center;
          color: #00f0ff;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          padding: 12px;
          border-bottom: 1px solid #333;
          text-align: left;
        }
        th {
          background: #111;
          color: #00f0ff;
        }
        tr:hover {
          background: #222;
        }
        td button {
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
          transition: 0.3s;
        }
        td button:hover {
          opacity: 0.8;
        }
        .delete-btn {
          background: #ff4d4d;
          color: #fff;
        }
      `}</style>

      <div className="sensor-data-container">
        <h2>Sensor Data</h2>
        <table>
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
                      className="delete-btn"
                      onClick={() => handleDelete(d.id)}
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
    </div>
  );
}

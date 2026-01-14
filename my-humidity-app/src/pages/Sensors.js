import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", sensorType: "DHT22", description: "" });
  const [editId, setEditId] = useState(null);

  // Ambil role dari localStorage
  const role = localStorage.getItem("role"); // "admin" atau "user"
  const isAdmin = role === "admin";

  const fetchSensors = async () => {
    try {
      const res = await api.get("/sensors");
      setSensors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSensors(); }, []);

  // Handle submit hanya aktif untuk admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return; 
    try {
      if (editId) {
        await api.put(`/sensors/${editId}`, form);
      } else {
        await api.post("/sensors", form);
      }
      setForm({ name: "", location: "", sensorType: "DHT22", description: "" });
      setEditId(null);
      fetchSensors();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (sensor) => {
    if (!isAdmin) return;
    setForm({
      name: sensor.name,
      location: sensor.location,
      sensorType: sensor.sensor_type,
      description: sensor.description
    });
    setEditId(sensor.id);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Hapus sensor ini?")) {
      await api.delete(`/sensors/${id}`);
      fetchSensors();
    }
  };

  const regenerateToken = async (id) => {
    if (!isAdmin) return;
    const res = await api.post(`/sensors/${id}/regenerate-token`);
    alert(`New API Token: ${res.data.data.apiToken}`);
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Internal CSS */}
      <style>{`
        .sensors-container {
          padding: 20px;
        }
        h2 {
          text-align: center;
          color: #00f0ff;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          justify-content: center;
        }
        form input {
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: #222;
          color: #fff;
        }
        form button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: #00f0ff;
          color: #111;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        form button:hover {
          background: #00c0cc;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
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
          margin-right: 5px;
          padding: 5px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }
        td button:first-of-type {
          background: #00f0ff;
          color: #111;
        }
        td button:first-of-type:hover {
          background: #00c0cc;
        }
        td button:nth-of-type(2) {
          background: #ff4d4d;
          color: #fff;
        }
        td button:nth-of-type(2):hover {
          background: #cc0000;
        }
        td button:nth-of-type(3) {
          background: #ffa500;
          color: #111;
        }
        td button:nth-of-type(3):hover {
          background: #ff9500;
        }
      `}</style>

      <div className="sensors-container">
        <h2>Sensors</h2>

        {/* Form tambah/edit hanya untuk admin */}
        {isAdmin && (
          <form onSubmit={handleSubmit}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
            <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required/>
            <input placeholder="Type" value={form.sensorType} onChange={e => setForm({...form, sensorType: e.target.value})} required/>
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
            <button type="submit">{editId ? "Update" : "Add"} Sensor</button>
          </form>
        )}

        {/* Tabel sensors */}
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Location</th><th>Type</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sensors.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.location}</td>
                <td>{s.sensor_type}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                    <button onClick={() => regenerateToken(s.id)}>Regenerate Token</button>
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

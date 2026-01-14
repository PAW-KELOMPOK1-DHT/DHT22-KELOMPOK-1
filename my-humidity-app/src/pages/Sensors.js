import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", sensorType: "DHT22", description: "" });
  const [editId, setEditId] = useState(null);

  const fetchSensors = async () => {
    const res = await api.get("/sensors");
    setSensors(res.data.data);
  };

  useEffect(() => { fetchSensors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setForm({
      name: sensor.name,
      location: sensor.location,
      sensorType: sensor.sensor_type,
      description: sensor.description
    });
    setEditId(sensor.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus sensor ini?")) {
      await api.delete(`/sensors/${id}`);
      fetchSensors();
    }
  };

  const regenerateToken = async (id) => {
    const res = await api.post(`/sensors/${id}/regenerate-token`);
    alert(`New API Token: ${res.data.data.apiToken}`);
  };

  return (
    <div>
      <h2>Sensors</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
        <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})}/>
        <input placeholder="Type" value={form.sensorType} onChange={e => setForm({...form, sensorType: e.target.value})}/>
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
        <button type="submit">{editId ? "Update" : "Add"} Sensor</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Location</th><th>Type</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {sensors.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.location}</td>
              <td>{s.sensor_type}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
                <button onClick={() => regenerateToken(s.id)}>Regenerate Token</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

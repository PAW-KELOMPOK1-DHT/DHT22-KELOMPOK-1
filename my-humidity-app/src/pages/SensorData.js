import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function SensorData() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await api.get("/sensor-data?limit=50");
    setData(res.data.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data ini?")) {
      await api.delete(`/sensor-data/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <h2>Sensor Data</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Sensor</th><th>Humidity</th><th>Temperature</th><th>Timestamp</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.sensor?.name}</td>
              <td>{d.humidity}</td>
              <td>{d.temperature}</td>
              <td>{new Date(d.timestamp).toLocaleString()}</td>
              <td><button onClick={() => handleDelete(d.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

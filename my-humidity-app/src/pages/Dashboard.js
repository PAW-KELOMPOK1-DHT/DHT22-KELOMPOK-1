import React, { useEffect, useState } from "react";
import api from "../api/api";
import Card from "../components/Card";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSensors: 0,
    activeSensors: 0,
    totalLogs: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setError("");
      // Ambil statistik
      const resStats = await api.get("/dashboard/stats");
      setStats(resStats.data.data.statistics);

      // Ambil data chart 24 jam terakhir
      const resChart = await api.get("/dashboard/chart?period=24h");
      setChartData(resChart.data.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal memuat dashboard");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  return (
    <div className="dashboard" style={{ padding: "20px", fontFamily: "Roboto, sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#00f0ff", marginBottom: "20px" }}>Dashboard</h2>

      {error && <p style={{ color: "#ff4d4d", textAlign: "center" }}>{error}</p>}

      <div className="cards" style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        <Card title="Total Sensors" value={stats.totalSensors} color="blue" />
        <Card title="Active Sensors" value={stats.activeSensors} color="green" />
        <Card title="Total Logs" value={stats.totalLogs} color="orange" />
      </div>

      <div className="chart-container" style={{ background: "#111", padding: "20px", borderRadius: "10px", marginTop: "30px" }}>
        <h3 style={{ textAlign: "center" }}>Humidity Last 24 Hours</h3>
        <Chart data={chartData} />
      </div>
    </div>
  );
}

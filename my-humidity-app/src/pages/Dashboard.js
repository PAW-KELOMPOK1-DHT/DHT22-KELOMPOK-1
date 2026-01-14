import React, { useEffect, useState } from "react";
import api from "../api/api"; // interceptor token sudah include
import Card from "../components/Card";
import Chart from "../components/Chart";
import Navbar from "../components/Navbar"; // impor navbar

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSensors: 0,
    activeSensors: 0,
    totalLogs: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil token & role dari localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // admin atau user

  const isAdmin = role === "admin";

  const fetchStats = async () => {
    if (!token) {
      setError("Anda harus login terlebih dahulu");
      setLoading(false);
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Ambil statistik
      const resStats = await api.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(resStats.data.data.statistics);

      // Ambil data chart 24 jam terakhir
      const resChart = await api.get("/dashboard/chart?period=24h", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#00f0ff", marginTop: "50px" }}>
        Loading dashboard...
      </p>
    );

  return (
    <div
      className="dashboard"
      style={{
        fontFamily: "Roboto, sans-serif",
        color: "#fff",
        background: "#0f0f1a",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar isAdmin={isAdmin} />

      <div style={{ padding: "20px" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#00f0ff",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </h2>

        {error && (
          <p
            style={{
              color: "#ff4d4d",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
        )}

        <div
          className="cards"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <Card title="Total Sensors" value={stats.totalSensors} color="blue" />
          <Card
            title="Active Sensors"
            value={stats.activeSensors}
            color="green"
          />
          <Card title="Total Logs" value={stats.totalLogs} color="orange" />
        </div>

        <div
          className="chart-container"
          style={{
            background: "#111",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "30px",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Humidity Last 24 Hours
          </h3>
          <Chart data={chartData} />
        </div>

        {/* Tombol admin CRUD, hanya muncul jika admin */}
        {isAdmin && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#00f0ff",
                color: "#111",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => alert("Ini fitur CRUD admin")}
            >
              Admin CRUD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

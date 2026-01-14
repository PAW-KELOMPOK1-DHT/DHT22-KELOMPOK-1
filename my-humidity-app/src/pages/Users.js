import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar"; // import navbar

export default function Users() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // ambil role dari localStorage

  // Redirect jika bukan admin
  useEffect(() => {
    if (role !== "admin") {
      alert("Akses ditolak! Hanya admin yang bisa masuk ke halaman ini.");
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "user" });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/users/${editId}`, form);
      } else {
        await api.post("/users", form);
      }
      setForm({ username: "", email: "", role: "user" });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email, role: user.role });
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus user ini?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Internal CSS */}
      <style>{`
        .users-container {
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
        form input, form select {
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
        td button:last-of-type {
          background: #ff4d4d;
          color: #fff;
        }
        td button:last-of-type:hover {
          background: #cc0000;
        }
      `}</style>

      <div className="users-container">
        <h2>Users</h2>

        {/* Form tambah/edit */}
        <form onSubmit={handleSubmit}>
          <input 
            placeholder="Username" 
            value={form.username} 
            onChange={e => setForm({ ...form, username: e.target.value })} 
            required
          />
          <input 
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            required
          />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">{editId ? "Update" : "Add"} User</button>
        </form>

        {/* Tabel users */}
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

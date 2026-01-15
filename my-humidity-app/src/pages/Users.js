import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "user" });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/users/${editId}`, form);
      } 
      setForm({ username: "", email: "", role: "user" });
      setEditId(null);
      fetchUsers();
    } catch (err) { console.error(err); }
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
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editId ? "Update" : "Add"} User</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr>
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
  );
}

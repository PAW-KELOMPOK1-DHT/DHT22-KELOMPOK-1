import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Ambil token & role
      const token = res.data.token || res.data.data?.token;
      const role = res.data.user?.role || res.data.data?.user?.role;

      if (!token || !role) {
        setError("Token atau role tidak diterima dari server");
        return;
      }

      localStorage.setItem('token', token);   // simpan token
      localStorage.setItem('role', role);     // simpan role
      navigate('/dashboard');                 // redirect ke dashboard
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data?.message || "Login gagal");
      } else {
        setError("Gagal koneksi ke server");
      }
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
          font-family: 'Roboto', sans-serif;
          color: #fff;
        }
        .login-container {
          background: #111;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 255, 255, 0.3);
          width: 100%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-container h2 {
          color: #00f0ff;
          font-size: 2rem;
          margin-bottom: 25px;
          letter-spacing: 1px;
        }
        .login-container label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          text-align: left;
        }
        .login-container input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border-radius: 12px;
          border: none;
          background: #222;
          color: #fff;
          font-size: 1rem;
          transition: 0.3s;
        }
        .login-container input:focus {
          background: #333;
          box-shadow: 0 0 10px #00f0ff;
          outline: none;
        }
        .login-container button {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: #00f0ff;
          color: #111;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .login-container button:hover {
          background: #00c0cc;
          transform: translateY(-2px);
        }
        .register-link {
          margin-top: 18px;
          font-size: 0.95rem;
          text-align: center;
        }
        .register-link a {
          color: #00f0ff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }
        .register-link a:hover {
          color: #00c0cc;
        }
        .error {
          color: #ff4d4d;
          margin-bottom: 15px;
          font-weight: 600;
          text-align: center;
        }
      `}</style>

      <div className="login-container">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Masukkan email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Masukkan password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Login</button>
        </form>
        <div className="register-link">
          Belum punya akun? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

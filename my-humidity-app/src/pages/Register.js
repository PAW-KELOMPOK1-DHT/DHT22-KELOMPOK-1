import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Register gagal');
    }
  };

  return (
    <div className="register-page">
      <style>{`
        .register-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #0f0f1a;
          color: #fff;
          font-family: 'Roboto', sans-serif;
        }
        .register-container {
          background: #111;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          width: 350px;
          text-align: center;
        }
        .register-container h2 {
          color: #00f0ff;
          margin-bottom: 20px;
        }
        .register-container input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          border: none;
          font-size: 16px;
        }
        .register-container button {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border-radius: 5px;
          border: none;
          background: #00f0ff;
          color: #111;
          font-size: 16px;
          cursor: pointer;
        }
        .register-container button:hover {
          background: #00c0cc;
        }
        .register-container p {
          margin-top: 15px;
        }
        .register-container a {
          color: #00f0ff;
          text-decoration: none;
        }
        .register-container a:hover {
          text-decoration: underline;
        }
        .error {
          color: #f00;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="register-container">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

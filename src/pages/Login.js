// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [role, setRole] = useState('etudiant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { role, email, password });

      const token = res.data.token;
      // خزننا التوكن والدور
      onLogin(token, role);
      setMessage('✅ تم تسجيل الدخول بنجاح');
      navigate(role === 'etudiant' ? '/etudiant' : '/enseignant');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ فشل في تسجيل الدخول');
    }
  };

  return (
    <div>
      <h2>🔐 تسجيل الدخول</h2>
      <form onSubmit={handleSubmit}>
        <label>الدور:</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="etudiant">🎓 Etudiant</option>
          <option value="enseignant">👨‍🏫 Enseignant</option>
        </select>
        <label>البريد الإلكتروني:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <label>كلمة السر:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button type="submit">دخول</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;

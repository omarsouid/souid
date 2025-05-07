// src/pages/AddEmploi.jsx
import React, { useState } from 'react';

function AddEmploi() {
  const [jour, setJour] = useState('');
  const [horaire, setHoraire] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jour.trim() || !horaire.trim() || !description.trim()) {
      setMessage('⚠️ الرجاء ملء جميع الحقول');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/enseignant/emploi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jour, horaire, description })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'حدث خطأ');
      setMessage('✅ تم إضافة الجدول بنجاح');
      setJour('');
      setHoraire('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>➕ إضافة جدول</h2>
      <form onSubmit={handleSubmit}>
        <label>اليوم:</label>
        <input
          type="text"
          value={jour}
          onChange={e => setJour(e.target.value)}
          required
        />
        <label>الساعة:</label>
        <input
          type="text"
          value={horaire}
          onChange={e => setHoraire(e.target.value)}
          required
        />
        <label>الوصف:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit">أضف الجدول</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddEmploi;

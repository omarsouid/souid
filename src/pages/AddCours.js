// src/pages/AddCours.jsx
import React, { useState } from 'react';

function AddCours() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre.trim() || !description.trim()) {
      setMessage('⚠️ الرجاء ملء جميع الحقول');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/enseignant/cours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ titre, description })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'حدث خطأ');
      setMessage('✅ تم إضافة المادة بنجاح');
      setTitre('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>➕ إضافة مادة</h2>
      <form onSubmit={handleSubmit}>
        <label>عنوان المادة:</label>
        <input
          type="text"
          value={titre}
          onChange={e => setTitre(e.target.value)}
          required
        />
        <label>الوصف:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit">أضف المادة</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCours;

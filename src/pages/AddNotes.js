// src/pages/AddNotes.jsx
import React, { useState, useEffect } from 'react';

function AddNotes() {
  const [etudiants, setEtudiants] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [note, setNote]           = useState('');
  const [message, setMessage]     = useState('');

  // 1) جلب الطلبة من السيرفر فور ما الصفحة تتحمّل
  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const res = await fetch('http://localhost:3100/api/etudiants', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        if (!res.ok) throw new Error('فشل في جلب الطلبة');
        const data = await res.json();
        setEtudiants(data);
      } catch (err) {
        console.error(err);
        setMessage('❌ ما نجمتش نجيب الطلبة');
      }
    };
    fetchEtudiants();
  }, []);

  // 2) إرسال الملاحظة
  const handleSubmit = async e => {
    e.preventDefault();
    if (!studentId || !note) {
      setMessage('⚠️ رجاءً اختر طالب وأدخل الملاحظة');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/enseignant/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ studentId, note: parseFloat(note) })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
      setMessage('✅ تمت إضافة الملاحظة بنجاح');
      setStudentId('');
      setNote('');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>➕ إضافة ملاحظة</h2>
      <form onSubmit={handleSubmit}>
        <label>اختر الطالب:</label>
        <select
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          required
        >
          <option value="">-- اختر طالب --</option>
          {etudiants.map(et => (
            <option key={et.id} value={et.id}>
              {et.username}
            </option>
          ))}
        </select>

        <label>الملاحظة (رقم):</label>
        <input
          type="number"
          step="0.01"
          value={note}
          onChange={e => setNote(e.target.value)}
          required
        />

        <button type="submit">أضف الملاحظة</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddNotes;

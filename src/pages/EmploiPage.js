// src/pages/EmploiPage.jsx
import React, { useEffect, useState } from 'react';

function EmploiPage() {
  const [emploi, setEmploi] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmploi = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/etudiant/emploi`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('فشل في تحميل الجدول');
        setEmploi(await res.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchEmploi();
  }, []);

  return (
    <div>
      <h2>📅 جدول الأستاذ</h2>
      {error && <p>❌ {error}</p>}
      {emploi.length === 0 ? (
        <p>لا توجد جداول.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>اليوم</th>
              <th>الساعة</th>
              <th>الوصف</th>
            </tr>
          </thead>
          <tbody>
            {emploi.map(e => (
              <tr key={e.id}>
                <td>{e.jour}</td>
                <td>{e.horaire}</td>
                <td>{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmploiPage;

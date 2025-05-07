// src/pages/CoursPage.jsx
import React, { useEffect, useState } from 'react';

function CoursPage() {
  const [cours, setCours] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/etudiant/cours`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('فشل في تحميل المواد');
        setCours(await res.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchCours();
  }, []);

  return (
    <div>
      <h2>📚 المواد المتاحة</h2>
      {error && <p>❌ {error}</p>}
      {cours.length === 0 ? (
        <p>لا توجد مواد.</p>
      ) : (
        <ul>
          {cours.map(c => (
            <li key={c.id}>
              <strong>{c.titre}</strong> — {c.description || 'بدون وصف'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoursPage;

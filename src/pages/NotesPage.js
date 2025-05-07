// src/pages/NotesPage.jsx
import React, { useEffect, useState } from 'react';

function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        if (!res.ok) throw new Error('Failed to load notes');
        setNotes(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>📊 ملاحظاتك</h2>
      {notes.length === 0 ? (
        <p>لا توجد ملاحظات بعد.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>📘 المادة</th>
              <th>🧑‍🏫 الأستاذ</th>
              <th>✅ الملاحظة</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id}>
                <td>{n.matiere}</td>
                <td>{n.enseignant}</td>
                <td>{n.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NotesPage;

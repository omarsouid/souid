// src/pages/EtudiantDashboard.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function EtudiantDashboard() {
  return (
    <div>
      <h1>🎓 لوحة الطالب</h1>
      <nav>
        <Link to="/etudiant/cours">المواد</Link> |{' '}
        <Link to="/etudiant/emploi">الجدول</Link> |{' '}
        <Link to="/etudiant/notes">ملاحظاتي</Link>
      </nav>
      <Outlet />
    </div>
  );
}

// src/pages/EnseignantDashboard.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function EnseignantDashboard() {
  return (
    <div>
      <h1>👨‍🏫 لوحة الأستاذ</h1>
      <nav>
        <Link to="/enseignant/cours">إضافة مادة</Link> |{' '}
        <Link to="/enseignant/emploi">إضافة جدول</Link> |{' '}
        <Link to="/enseignant/notes">إضافة ملاحظة</Link>
      </nav>
      <Outlet />
    </div>
  );
}

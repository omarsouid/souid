// src/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ role, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '❌ إغلاق القائمة' : '📋 قائمة التنقل'}
      </button>
      {isOpen && (
        <ul>
          {/* روابط عامة */}
          <li><Link to="/">🏠 الرئيسية</Link></li>
          <li><Link to="/about">ℹ️ حول</Link></li>
          <li><Link to="/contact">📞 تواصل</Link></li>

          {/* غير مسجل */}
          {!role && (
            <>
              <li><Link to="/login">🔐 تسجيل الدخول</Link></li>
              <li><Link to="/inscription">📝 إنشاء حساب</Link></li>
            </>
          )}

          {/* طالب */}
          {role === 'etudiant' && (
            <>
              <li><Link to="/etudiant/cours">📚 المواد</Link></li>
              <li><Link to="/etudiant/emploi">📅 الجدول</Link></li>
              <li><Link to="/etudiant/notes">📊 ملاحظاتي</Link></li>
            </>
          )}

          {/* أستاذ */}
          {role === 'enseignant' && (
            <>
              <li><Link to="/enseignant/cours">➕ إضافة مادة</Link></li>
              <li><Link to="/enseignant/emploi">➕ إضافة جدول</Link></li>
              <li><Link to="/enseignant/notes">➕ إضافة ملاحظة</Link></li>
            </>
          )}

          {/* تسجيل خروج */}
          {role && (
            <li><button onClick={onLogout}>🚪 تسجيل خروج</button></li>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;

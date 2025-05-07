// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Inscription from './pages/Inscription';
import Login from './pages/Login';

import EtudiantDashboard from './pages/EtudiantDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';

import CoursPage from './pages/CoursPage';
import EmploiPage from './pages/EmploiPage';
import NotesPage from './pages/NotesPage';

import AddCours from './pages/AddCours';
import AddEmploi from './pages/AddEmploi';
import AddNotes from './pages/AddNotes';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole]   = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    if (t && r) {
      setToken(t);
      setRole(r);
    }
  }, []);

  const handleLogin = (t, r) => {
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    setToken(t);
    setRole(r);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  const isEtudiant   = token && role === 'etudiant';
  const isEnseignant = token && role === 'enseignant';

  return (
    <BrowserRouter>
      <Navbar role={role} onLogout={handleLogout} />

      <Routes>
        {/* عامة */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* تسجيل دخول */}
        <Route
          path="/login"
          element={
            token
              ? <Navigate to={role === 'etudiant' ? "/etudiant" : "/enseignant"} replace />
              : <Login onLogin={handleLogin} />
          }
        />

        {/* لوحة الطالب */}
        <Route
          path="/etudiant/*"
          element={isEtudiant ? <EtudiantDashboard /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="cours" replace />} />
          <Route path="cours"  element={<CoursPage />} />
          <Route path="emploi" element={<EmploiPage />} />
          <Route path="notes"  element={<NotesPage />} />
        </Route>

        {/* لوحة الأستاذ */}
        <Route
          path="/enseignant/*"
          element={isEnseignant ? <EnseignantDashboard /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="cours" replace />} />
          <Route path="cours"  element={<AddCours />} />
          <Route path="emploi" element={<AddEmploi />} />
          <Route path="notes"  element={<AddNotes />} />
        </Route>

        {/* المسار الافتراضي */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

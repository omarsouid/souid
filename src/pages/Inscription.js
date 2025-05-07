import React, { useState } from 'react';
import axios from 'axios';

function Inscription() {
  const [role, setRole] = useState("etudiant");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState(""); // bac_id أو matricule
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من الإدخالات
    if (!username || !email || !password || !identifier) {
      setMessage("⚠️ الرجاء ملء جميع الحقول");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        role,
        username,
        email,
        password,
        identifier,
      });
      setMessage(res.data.message || "✅ تم التسجيل بنجاح");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "❌ فشل في التسجيل";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setIdentifier(""); // reset identifier
  };

  return (
    <div>
      <h2>📝 تسجيل حساب جديد</h2>
      <form onSubmit={handleSubmit}>
        <label>الاسم الكامل:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />

        <label>البريد الإلكتروني:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>كلمة السر:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label>الدور:</label>
        <select value={role} onChange={handleRoleChange}>
          <option value="etudiant">🎓 Etudiant</option>
          <option value="enseignant">👨‍🏫 Enseignant</option>
        </select>

        <label>
          {role === "etudiant" ? "معرف الباكالوريا (BAC ID):" : "معرف الأستاذ (Matricule):"}
        </label>
        <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? "⏳ جاري التسجيل..." : "🔐 تسجيل"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Inscription;

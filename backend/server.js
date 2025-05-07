// server.js
const express    = require("express");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
const bodyParser = require("body-parser");
const { Pool }   = require("pg");

const app  = express();
const PORT = 3100;

app.use(cors());
app.use(bodyParser.json());

// إعداد الاتصال بقاعدة البيانات
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Enseingant",
  password: "omar",
  port: 5432,
});

const SECRET_KEY = "mysecretkey";

// Middleware للتحقق من JWT
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) 
    return res.status(403).json({ message: "Authorization header missing" });
  const token = header.split(" ")[1];
  if (!token) 
    return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) 
      return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;  // يحتوي الآن على { id, username, role }
    next();
  });
}

// Middleware للتأكد من الدور
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

// ------- تسجيل مستخدم جديد (طالب أو أستاذ) -------
app.post("/api/register", async (req, res) => {
  const { role, username, email, password, identifier } = req.body;
  if (!role || !username || !email || !password || !identifier) {
    return res.status(400).json({ message: "❌ جميع الحقول مطلوبة" });
  }

  try {
    let checkQuery, insertQuery;
    const params = [username, email, password, identifier];

    if (role === "etudiant") {
      checkQuery  = "SELECT 1 FROM users WHERE bac_id = $1";
      insertQuery = `
        INSERT INTO users (username, email, password, role, bac_id)
        VALUES ($1, $2, $3, 'etudiant', $4) RETURNING *`;
    } else if (role === "enseignant") {
      checkQuery  = "SELECT 1 FROM users WHERE matricule = $1";
      insertQuery = `
        INSERT INTO users (username, email, password, role, matricule)
        VALUES ($1, $2, $3, 'enseignant', $4) RETURNING *`;
    } else {
      return res.status(400).json({ message: "❌ دور غير صالح" });
    }

    const exists = await pool.query(checkQuery, [identifier]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "⚠️ المعرف مستعمل من قبل" });
    }

    const result = await pool.query(insertQuery, params);
    res.json({ message: "✅ تم التسجيل بنجاح", user: result.rows[0] });
  } catch (err) {
    console.error("Error /api/register:", err);
    res.status(500).json({ message: "🚨 خطأ في الخادم" });
  }
});

// ------- تسجيل الدخول الموحد -------
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "❌ جميع الحقول مطلوبة" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2",
      [email, role]
    );
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ message: "❌ البريد أو كلمة السر خاطئة" });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Error /api/login:", err);
    res.status(500).json({ message: "🚨 خطأ في الخادم" });
  }
});

// ------- التحقق من صلاحية التوكن -------
app.post("/api/validateJWT", (req, res) => {
  const header = req.headers.authorization;
  if (!header) 
    return res.status(403).json({ response: false, message: "Token manquant" });
  const token = header.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) 
      return res.status(403).json({ response: false, message: "Token invalide" });
    res.json({ response: true, user: decoded.username, role: decoded.role });
  });
});

// ------- جلب دروس الطالب -------
app.get(
  "/api/etudiant/cours",
  verifyToken,
  requireRole("etudiant"),
  async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM cours");
      res.json(result.rows);
    } catch (err) {
      console.error("Error GET /api/etudiant/cours:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- جلب جدول الطالب -------
app.get(
  "/api/etudiant/emploi",
  verifyToken,
  requireRole("etudiant"),
  async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM emploi");
      res.json(result.rows);
    } catch (err) {
      console.error("Error GET /api/etudiant/emploi:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- جلب ملاحظات الطالب -------
app.get(
  "/api/notes",
  verifyToken,
  requireRole("etudiant"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          n.id,
          n.note,
          n.matiere,
          n.remarque,
          u.username AS enseignant
        FROM notes n
        JOIN users u ON n.enseignant_id = u.id
        WHERE n.etudiant_id = $1
        `,
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error GET /api/notes:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- جلب قائمة الطلبة للأستاذ -------
app.get(
  "/api/etudiants",
  verifyToken,
  requireRole("enseignant"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, username FROM users WHERE role = 'etudiant'"
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error GET /api/etudiants:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- جلب ملاحظات الأستاذ -------
app.get(
  "/api/enseignant/notes",
  verifyToken,
  requireRole("enseignant"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          n.id,
          et.username   AS etudiant,
          n.matiere,
          n.remarque,
          n.note
        FROM notes n
        JOIN users et ON n.etudiant_id = et.id
        WHERE n.enseignant_id = $1
        ORDER BY n.id DESC
        `,
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error GET /api/enseignant/notes:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- الأستاذ يضيف مادة -------
app.post(
  "/api/enseignant/cours",
  verifyToken,
  requireRole("enseignant"),
  async (req, res) => {
    const { titre, description } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO cours (titre, description, enseignant_id) VALUES ($1, $2, $3) RETURNING *",
        [titre, description, req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error POST /api/enseignant/cours:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- الأستاذ يضيف جدول (emploi) -------
app.post(
  "/api/enseignant/emploi",
  verifyToken,
  requireRole("enseignant"),
  async (req, res) => {
    const { jour, horaire, description } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO emploi (jour, horaire, description, enseignant_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [jour, horaire, description, req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error POST /api/enseignant/emploi:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------- الأستاذ يضيف ملاحظة -------
app.post(
  "/api/enseignant/notes",
  verifyToken,
  requireRole("enseignant"),
  async (req, res) => {
    const { studentId, note } = req.body;
    if (!studentId || note == null) {
      return res.status(400).json({ message: "❌ جميع الحقول مطلوبة" });
    }
    try {
      // تأكيد وجود الطالب
      const chk = await pool.query(
        "SELECT 1 FROM users WHERE id = $1 AND role = 'etudiant'",
        [studentId]
      );
      if (chk.rows.length === 0) {
        return res.status(404).json({ message: "الطالب غير موجود" });
      }
      // إدراج الملاحظة
      const result = await pool.query(
        `
        INSERT INTO notes 
          (etudiant_id, enseignant_id, note)
        VALUES 
          ($1, $2, $3)
        RETURNING *
        `,
        [studentId, req.user.id, note]
      );
      res.json({ message: "✅ تم إضافة الملاحظة", note: result.rows[0] });
    } catch (err) {
      console.error("Error POST /api/enseignant/notes:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}/`);
});

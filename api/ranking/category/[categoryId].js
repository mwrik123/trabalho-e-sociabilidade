const { Pool } = require("pg");

// Configuração do PostgreSQL
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const {
    query: { categoryId },
  } = req;

  if (!categoryId) {
    res.status(400).json({ message: "categoryId é obrigatório" });
    return;
  }

  try {
    if (req.method === "GET") {
      // Buscar ranking filtrado por categoria
      const result = await pool.query(
        `
        SELECT 
          u.id,
          u.name,
          u.matricula,
          COALESCE(SUM(qr.score), 0)::INTEGER as "totalScore",
          COUNT(qr.id)::INTEGER as "totalQuizzes",
          CASE 
            WHEN COUNT(qr.id) > 0 
            THEN ROUND(AVG(CAST(qr.score as DECIMAL) / CAST(qr.total_questions as DECIMAL) * 100), 2)::FLOAT
            ELSE 0::FLOAT 
          END as "averageScore",
          MAX(qr.created_at) as "lastQuizDate"
        FROM users u
        LEFT JOIN quiz_results qr ON u.id = qr.user_id AND qr.category_id = $1
        GROUP BY u.id, u.name, u.matricula
        HAVING COUNT(qr.id) > 0
        ORDER BY "totalScore" DESC, "averageScore" DESC
        LIMIT 50
      `,
        [categoryId]
      );
      // Para cada usuário, buscar o histórico de quizzes daquela categoria
      const users = result.rows;
      for (const user of users) {
        const historyRes = await pool.query(
          `SELECT score, total_questions as "totalQuestions", created_at as "completedAt", time_spent as "timeSpent" FROM quiz_results WHERE user_id = $1 AND category_id = $2 ORDER BY created_at DESC LIMIT 5`,
          [user.id, categoryId]
        );
        user.quizHistory = historyRes.rows;
      }
      res.status(200).json(users);
    } else {
      res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
}

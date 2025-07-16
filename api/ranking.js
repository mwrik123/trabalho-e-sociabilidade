const { Pool } = require("pg");

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

export default async function handler(req, res) {
  // Configurar CORS
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

  try {
    // Inicializar tabelas se não existirem
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        category_id VARCHAR(100) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_spent INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    if (req.method === "GET") {
      // Buscar ranking
      const result = await pool.query(`
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
        LEFT JOIN quiz_results qr ON u.id = qr.user_id
        GROUP BY u.id, u.name, u.matricula
        HAVING COUNT(qr.id) > 0
        ORDER BY "totalScore" DESC, "averageScore" DESC
        LIMIT 50
      `);

      // Para cada usuário, buscar o histórico de quizzes
      const users = result.rows;
      for (const user of users) {
        const historyRes = await pool.query(
          `SELECT score, total_questions as "totalQuestions", created_at as "completedAt", time_spent as "timeSpent" FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
          [user.id]
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

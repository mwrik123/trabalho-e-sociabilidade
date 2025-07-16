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

// Inicializar tabelas
async function initializeTables() {
  try {
    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de resultados do quiz
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        correct_answers INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabelas inicializadas com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
  }
}

// Handler principal para todas as rotas
module.exports = async (req, res) => {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url.replace("/api", "");

  try {
    // Inicializar tabelas na primeira requisição
    if (!global.tablesInitialized) {
      await initializeTables();
      global.tablesInitialized = true;
    }

    // Health check
    if (path === "/health" && method === "GET") {
      return res.status(200).json({ status: "ok", message: "API funcionando" });
    }

    // Rotas de usuários
    if (path === "/users" && method === "POST") {
      const { name, matricula } = req.body;

      if (!name || !matricula) {
        return res
          .status(400)
          .json({ error: "Nome e matrícula são obrigatórios" });
      }

      // Verificar se usuário já existe
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE matricula = $1",
        [matricula]
      );

      if (existingUser.rows.length > 0) {
        return res.status(200).json({
          success: true,
          user: existingUser.rows[0],
          message: "Usuário já existe",
        });
      }

      // Criar novo usuário
      const result = await pool.query(
        "INSERT INTO users (name, matricula) VALUES ($1, $2) RETURNING *",
        [name, matricula]
      );

      return res.status(201).json({
        success: true,
        user: result.rows[0],
        message: "Usuário criado com sucesso",
      });
    }

    // Buscar usuário por matrícula
    if (path.startsWith("/users/") && method === "GET") {
      const matricula = path.split("/")[2];

      const result = await pool.query(
        "SELECT * FROM users WHERE matricula = $1",
        [matricula]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    }

    // Salvar resultado do quiz
    if (path === "/quiz-results" && method === "POST") {
      const { userId, correctAnswers, totalQuestions, score } = req.body;

      if (
        !userId ||
        correctAnswers === undefined ||
        !totalQuestions ||
        score === undefined
      ) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      const result = await pool.query(
        "INSERT INTO quiz_results (user_id, correct_answers, total_questions, score) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, correctAnswers, totalQuestions, score]
      );

      return res.status(201).json({
        success: true,
        result: result.rows[0],
        message: "Resultado salvo com sucesso",
      });
    }

    // Buscar ranking
    if (path === "/ranking" && method === "GET") {
      const result = await pool.query(`
        SELECT 
          u.name,
          u.matricula,
          COUNT(qr.id) as total_quizzes,
          ROUND(AVG(qr.score), 2) as average_score,
          MAX(qr.score) as best_score,
          SUM(qr.correct_answers) as total_correct
        FROM users u
        LEFT JOIN quiz_results qr ON u.id = qr.user_id
        GROUP BY u.id, u.name, u.matricula
        ORDER BY average_score DESC NULLS LAST, best_score DESC NULLS LAST
      `);

      const ranking = result.rows.map((row, index) => ({
        position: index + 1,
        name: row.name,
        matricula: row.matricula,
        totalQuizzes: parseInt(row.total_quizzes) || 0,
        averageScore: parseFloat(row.average_score) || 0,
        bestScore: parseFloat(row.best_score) || 0,
        totalCorrect: parseInt(row.total_correct) || 0,
      }));

      return res.status(200).json({
        success: true,
        ranking,
      });
    }

    // Rota não encontrada
    return res.status(404).json({ error: "Rota não encontrada" });
  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

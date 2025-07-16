const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões cloud
  },
});

// Função para inicializar as tabelas
async function initializeTables() {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de resultados dos quizzes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        quiz_type VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        time_taken INTEGER, -- em segundos
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabelas inicializadas com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
  }
}

// Endpoint de saúde
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API funcionando!" });
});

// Endpoint para registrar usuário
app.post("/users", async (req, res) => {
  try {
    const { name, matricula } = req.body;

    if (!name || !matricula) {
      return res.status(400).json({
        success: false,
        message: "Nome e matrícula são obrigatórios",
      });
    }

    // Verificar se a matrícula já existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE matricula = $1",
      [matricula]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Matrícula já cadastrada",
      });
    }

    // Inserir novo usuário
    const result = await pool.query(
      "INSERT INTO users (name, matricula) VALUES ($1, $2) RETURNING *",
      [name, matricula]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Endpoint para buscar usuário por matrícula
app.get("/users/:matricula", async (req, res) => {
  try {
    const { matricula } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE matricula = $1",
      [matricula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Endpoint para salvar resultado de quiz
app.post("/quiz-results", async (req, res) => {
  try {
    const {
      matricula,
      quizType,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken,
    } = req.body;

    if (!matricula || !quizType || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos",
      });
    }

    // Buscar usuário pela matrícula
    const userResult = await pool.query(
      "SELECT id FROM users WHERE matricula = $1",
      [matricula]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const userId = userResult.rows[0].id;

    // Inserir resultado do quiz
    const result = await pool.query(
      "INSERT INTO quiz_results (user_id, quiz_type, score, total_questions, correct_answers, time_taken) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, quizType, score, totalQuestions, correctAnswers, timeTaken]
    );

    res.json({
      success: true,
      result: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Endpoint para obter ranking
app.get("/ranking", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.name,
        u.matricula,
        COUNT(qr.id) as total_quizzes,
        SUM(qr.correct_answers) as total_correct,
        SUM(qr.total_questions) as total_questions,
        ROUND(
          (SUM(qr.correct_answers)::decimal / NULLIF(SUM(qr.total_questions), 0)) * 100, 
          2
        ) as accuracy,
        MAX(qr.created_at) as last_quiz
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr.user_id
      GROUP BY u.id, u.name, u.matricula
      ORDER BY accuracy DESC NULLS LAST, total_correct DESC, total_quizzes DESC
    `);

    const ranking = result.rows.map((row, index) => ({
      position: index + 1,
      name: row.name,
      matricula: row.matricula,
      totalQuizzes: parseInt(row.total_quizzes) || 0,
      totalCorrect: parseInt(row.total_correct) || 0,
      totalQuestions: parseInt(row.total_questions) || 0,
      accuracy: parseFloat(row.accuracy) || 0,
      lastQuiz: row.last_quiz,
    }));

    res.json({
      success: true,
      ranking,
    });
  } catch (error) {
    console.error("Erro ao obter ranking:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Endpoint para obter estatísticas de um usuário específico
app.get("/users/:matricula/stats", async (req, res) => {
  try {
    const { matricula } = req.params;

    const result = await pool.query(
      `
      SELECT 
        u.name,
        u.matricula,
        COUNT(qr.id) as total_quizzes,
        SUM(qr.correct_answers) as total_correct,
        SUM(qr.total_questions) as total_questions,
        ROUND(
          (SUM(qr.correct_answers)::decimal / NULLIF(SUM(qr.total_questions), 0)) * 100, 
          2
        ) as accuracy
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr.user_id
      WHERE u.matricula = $1
      GROUP BY u.id, u.name, u.matricula
    `,
      [matricula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const stats = {
      name: result.rows[0].name,
      matricula: result.rows[0].matricula,
      totalQuizzes: parseInt(result.rows[0].total_quizzes) || 0,
      totalCorrect: parseInt(result.rows[0].total_correct) || 0,
      totalQuestions: parseInt(result.rows[0].total_questions) || 0,
      accuracy: parseFloat(result.rows[0].accuracy) || 0,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initializeTables();
});

// Tratamento de erro global
process.on("uncaughtException", (error) => {
  console.error("Erro não capturado:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rejeitada:", reason);
});

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const os = require("os");

// Ignorar certificados SSL auto-assinados
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const PORT = process.env.PORT || 3001;

// Função para obter IP local
function getLocalIP() {
  // Forçar o uso do IP do Expo para desenvolvimento
  return "192.168.1.66";

  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === "IPv4" && !interface.internal) {
        return interface.address;
      }
    }
  }
  return "localhost";
}

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Configuração do banco PostgreSQL
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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

    // Criar tabela de resultados de quiz
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id VARCHAR(50) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_spent INTEGER
      )
    `);

    console.log("Tabelas inicializadas com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
  }
}

// Rotas da API

// Testar conexão
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "OK",
      message: "API funcionando!",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Erro na conexão com banco de dados",
      error: error.message,
    });
  }
});

// Criar usuário
app.post("/api/users", async (req, res) => {
  try {
    const { name, matricula } = req.body;

    if (!name || !matricula) {
      return res.status(400).json({
        error: "Nome e matrícula são obrigatórios",
      });
    }

    // Primeiro, tentar inserir um novo usuário
    try {
      const result = await pool.query(
        "INSERT INTO users (name, matricula) VALUES ($1, $2) RETURNING *",
        [name, matricula]
      );
      res.status(201).json(result.rows[0]);
    } catch (insertError) {
      if (insertError.code === "23505") {
        // Unique violation - matrícula já existe, então atualizamos o nome
        const updateResult = await pool.query(
          "UPDATE users SET name = $1 WHERE matricula = $2 RETURNING *",
          [name, matricula]
        );
        res.status(200).json({
          ...updateResult.rows[0],
          _updated: true, // Marca que foi atualizado, não criado
        });
      } else {
        throw insertError;
      }
    }
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar/atualizar usuário",
      details: error.message,
    });
  }
});

// Buscar usuário por matrícula
app.get("/api/users/:matricula", async (req, res) => {
  try {
    const { matricula } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE matricula = $1",
      [matricula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar usuário",
      details: error.message,
    });
  }
});

// Salvar resultado do quiz
app.post("/api/quiz-results", async (req, res) => {
  try {
    const {
      userId,
      categoryId,
      categoryName,
      score,
      totalQuestions,
      timeSpent,
    } = req.body;

    if (
      !userId ||
      !categoryId ||
      !categoryName ||
      score === undefined ||
      !totalQuestions
    ) {
      return res.status(400).json({
        error: "Dados incompletos para salvar resultado",
      });
    }

    const result = await pool.query(
      `INSERT INTO quiz_results (user_id, category_id, category_name, score, total_questions, time_spent) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, categoryId, categoryName, score, totalQuestions, timeSpent]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao salvar resultado do quiz",
      details: error.message,
    });
  }
});

// Buscar ranking
app.get("/api/ranking", async (req, res) => {
  try {
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
        MAX(qr.completed_at) as "lastQuizDate"
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr.user_id
      GROUP BY u.id, u.name, u.matricula
      ORDER BY "totalScore" DESC, "averageScore" DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar ranking",
      details: error.message,
    });
  }
});

// Buscar ranking por categoria
app.get("/api/ranking/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.matricula,
        qr.category_name as "categoryName",
        COALESCE(SUM(qr.score), 0)::INTEGER as "totalScore",
        COUNT(qr.id)::INTEGER as "totalQuizzes",
        ROUND(AVG(CAST(qr.score as DECIMAL) / CAST(qr.total_questions as DECIMAL) * 100), 2)::FLOAT as "averageScore",
        MAX(qr.completed_at) as "lastQuizDate",
        MAX(qr.score)::INTEGER as "bestScore",
        MIN(qr.score)::INTEGER as "worstScore",
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'score', qr.score,
            'totalQuestions', qr.total_questions,
            'completedAt', qr.completed_at,
            'timeSpent', qr.time_spent
          ) ORDER BY qr.completed_at DESC
        ) as "quizHistory"
      FROM users u
      INNER JOIN quiz_results qr ON u.id = qr.user_id
      WHERE qr.category_id = $1
      GROUP BY u.id, u.name, u.matricula, qr.category_name
      ORDER BY "totalScore" DESC, "averageScore" DESC
      LIMIT 50
    `,
      [categoryId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar ranking por categoria",
      details: error.message,
    });
  }
});

// Buscar categorias disponíveis
app.get("/api/ranking/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        category_id as "categoryId",
        category_name as "categoryName",
        COUNT(DISTINCT user_id) as "totalParticipants",
        COUNT(*) as "totalQuizzes"
      FROM quiz_results
      GROUP BY category_id, category_name
      ORDER BY "totalQuizzes" DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar categorias",
      details: error.message,
    });
  }
});

// Buscar histórico do usuário
app.get("/api/users/:userId/history", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT * FROM quiz_results 
       WHERE user_id = $1 
       ORDER BY completed_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar histórico do usuário",
      details: error.message,
    });
  }
});

// Inicializar servidor
async function startServer() {
  try {
    await initializeTables();

    const localIP = getLocalIP();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API rodando na porta ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}/api/health`);
      console.log(`📱 Expo Go: http://${localIP}:${PORT}/api/health`);
      console.log(
        `\n📋 Para usar no Expo Go, configure o serviço de database com:`
      );
      console.log(`   BASE_URL: http://${localIP}:${PORT}/api`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();

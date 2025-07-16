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
    if (req.method === "POST") {
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
          status: "ERROR",
          message: "Todos os campos são obrigatórios",
        });
      }

      // Salvar resultado do quiz
      const result = await pool.query(
        `INSERT INTO quiz_results (user_id, category_id, category_name, score, total_questions, time_spent) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          userId,
          categoryId,
          categoryName,
          score,
          totalQuestions,
          timeSpent || null,
        ]
      );

      res.status(201).json({
        status: "SUCCESS",
        message: "Resultado salvo com sucesso",
        result: result.rows[0],
      });
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

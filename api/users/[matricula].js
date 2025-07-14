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

  const { matricula } = req.query;

  if (!matricula) {
    return res.status(400).json({
      status: "ERROR",
      message: "Matrícula é obrigatória",
    });
  }

  try {
    if (req.method === "GET") {
      // Buscar usuário por matrícula
      const result = await pool.query(
        "SELECT * FROM users WHERE matricula = $1",
        [matricula]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      res.status(200).json({
        status: "SUCCESS",
        user: result.rows[0],
      });
    } else if (req.method === "PUT") {
      // Atualizar usuário por matrícula
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          status: "ERROR",
          message: "Nome é obrigatório",
        });
      }

      const result = await pool.query(
        "UPDATE users SET name = $1 WHERE matricula = $2 RETURNING *",
        [name, matricula]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      res.status(200).json({
        status: "SUCCESS",
        message: "Usuário atualizado com sucesso",
        user: result.rows[0],
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

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

  try {
    if (req.method === "POST") {
      const { name, matricula } = req.body;

      if (!name || !matricula) {
        return res.status(400).json({
          status: "ERROR",
          message: "Nome e matrícula são obrigatórios",
        });
      }

      // Verificar se a matrícula já existe
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE matricula = $1",
        [matricula]
      );

      if (existingUser.rows.length > 0) {
        // Atualizar o nome do usuário existente
        const updateResult = await pool.query(
          "UPDATE users SET name = $1 WHERE matricula = $2 RETURNING *",
          [name, matricula]
        );

        return res.status(200).json({
          status: "SUCCESS",
          message: "Nome do usuário atualizado com sucesso",
          user: updateResult.rows[0],
        });
      }

      // Criar novo usuário
      const result = await pool.query(
        "INSERT INTO users (name, matricula) VALUES ($1, $2) RETURNING *",
        [name, matricula]
      );

      res.status(201).json({
        status: "SUCCESS",
        message: "Usuário criado com sucesso",
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

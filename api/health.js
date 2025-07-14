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

  if (req.method === "GET") {
    try {
      // Teste básico de conexão
      await pool.query("SELECT NOW()");

      res.status(200).json({
        status: "OK",
        message: "API funcionando!",
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro na API:", error);
      res.status(500).json({
        status: "ERROR",
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}

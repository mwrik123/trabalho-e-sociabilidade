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
    if (req.method === "GET") {
      // Buscar categorias de ranking
      const result = await pool.query(`
        SELECT category_id as "categoryId", category_name as "categoryName", COUNT(*) as "totalParticipants"
        FROM quiz_results
        GROUP BY category_id, category_name
        ORDER BY category_name
      `);
      res.status(200).json(result.rows);
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

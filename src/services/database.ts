// URL base da API do Vercel (sempre produção)
// const BASE_URL = "http://192.168.1.66:3001/api"
import Constants from "expo-constants";
const BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://trampo40.vercel.app/api";

console.log("🔧 Database service: Carregando módulo...");

// Função auxiliar para fazer requisições HTTP
async function makeRequest(endpoint: string, options: any = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`🌐 Fazendo requisição para: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    console.log(`📡 Status da resposta: ${response.status}`);
    console.log(`📡 Content-Type: ${response.headers.get("content-type")}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("❌ Resposta não é JSON:", textResponse);
      throw new Error("A resposta não é um JSON válido");
    }

    const result = await response.json();
    console.log(`✅ Resposta recebida:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
}

// Buscar usuário por matrícula
async function getUserByMatricula(matricula: string) {
  try {
    console.log(`🔍 Buscando usuário por matrícula: ${matricula}`);
    const result = await makeRequest(`/users/${matricula}`);
    return result.user || result; // Compatibilidade com diferentes formatos de resposta
  } catch (error) {
    console.log(`ℹ️ Usuário não encontrado: ${matricula}`);
    return null;
  }
}

// Criar usuário
async function createUser(name: string, matricula: string) {
  console.log(`👤 Criando/atualizando usuário: ${name} (${matricula})`);
  const result = await makeRequest("/users", {
    method: "POST",
    body: JSON.stringify({ name, matricula }),
  });

  const user = result.user || result;
  if (user._updated) {
    console.log(`🔄 Nome do usuário atualizado: ${name} (${matricula})`);
  } else {
    console.log(`✅ Novo usuário criado: ${name} (${matricula})`);
  }

  return user;
}

// Atualizar usuário
async function updateUser(matricula: string, name: string) {
  console.log(`🔄 Atualizando usuário: ${name} (${matricula})`);
  const result = await makeRequest(`/users/${matricula}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  return result.user || result;
}

// Salvar resultado do quiz
async function saveQuizResult(
  userId: number,
  categoryId: string,
  categoryName: string,
  score: number,
  totalQuestions: number,
  timeSpent?: number
) {
  console.log(
    `📊 Salvando resultado do quiz: userId=${userId}, score=${score}/${totalQuestions}`
  );
  return await makeRequest("/quiz-results", {
    method: "POST",
    body: JSON.stringify({
      userId,
      categoryId,
      categoryName,
      score,
      totalQuestions,
      timeSpent,
    }),
  });
}

// Buscar ranking
async function getRanking() {
  console.log(`🏆 Buscando ranking`);
  return await makeRequest("/ranking");
}

// Buscar ranking por categoria
async function getRankingByCategory(categoryId: string) {
  console.log(`🏆 Buscando ranking da categoria: ${categoryId}`);
  return await makeRequest(`/ranking/category/${categoryId}`);
}

// Buscar categorias disponíveis
async function getRankingCategories() {
  console.log(`📋 Buscando categorias disponíveis`);
  return await makeRequest("/ranking/categories");
}

// Buscar histórico do usuário
async function getUserHistory(userId: number) {
  console.log(`📈 Buscando histórico do usuário: ${userId}`);
  return await makeRequest(`/users/${userId}/history`);
}

// Testar conexão
async function testConnection() {
  try {
    console.log(`🔗 Testando conexão com a API`);
    const result = await makeRequest("/health");
    console.log("✅ API conectada com sucesso:", result);
    return true;
  } catch (error) {
    console.error("❌ Erro na conexão com a API:", error);
    return false;
  }
}

// Inicializar tabelas
async function initializeTables() {
  try {
    console.log(`🏗️ Inicializando tabelas (health check)`);
    const result = await makeRequest("/health");
    console.log("✅ API conectada com sucesso:", result);
  } catch (error) {
    console.error("❌ Erro ao conectar com a API:", error);
    throw error;
  }
}

console.log("🔧 Database service: Módulo carregado com sucesso");

// Exportação simples
const databaseService = {
  getUserByMatricula,
  createUser,
  updateUser,
  saveQuizResult,
  getRanking,
  getRankingByCategory,
  getRankingCategories,
  getUserHistory,
  testConnection,
  initializeTables,
};

console.log("🔧 Database service object:", databaseService);
console.log(
  "🔧 getUserByMatricula function:",
  typeof databaseService.getUserByMatricula
);

export default databaseService;

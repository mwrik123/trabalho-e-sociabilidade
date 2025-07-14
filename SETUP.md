# Trampo 4.0 - Quiz com Sistema de Ranking

## 🎯 Sistema Implementado

### ✅ Funcionalidades

- **Registro de usuário**: Tela inicial para inserir nome e matrícula
- **Sistema de ranking**: Classificação dos usuários por desempenho no quiz
- **Banco PostgreSQL**: Dados salvos na nuvem (PostgreSQL 16.9)
- **Compatível com Expo Go**: Funciona 100% no Expo Go

### 📊 Fluxo do Usuário

1. **Primeira vez**: App detecta e redireciona para tela de registro
2. **Registro**: Usuário insere nome e matrícula (salvo no banco)
3. **Menu principal**: Acesso ao quiz e ranking
4. **Quiz**: Resultados são salvos automaticamente no banco
5. **Ranking**: Visualização da classificação em tempo real

## 🚀 Como Usar

### 1. Iniciar o Servidor da API (OBRIGATÓRIO)

```bash
# Abra um terminal no diretório /api
cd api
node server.js
```

**⚠️ IMPORTANTE**: O servidor mostrará um IP, exemplo:

```
📱 Expo Go: http://192.168.1.8:3001/api/health
```

### 2. Configurar o IP no App

Edite o arquivo `src/services/database.ts` na linha 2:

```typescript
const BASE_URL = "http://SEU_IP_AQUI:3001/api";
```

### 3. Iniciar o Expo

```bash
# No diretório principal do projeto
npx expo start
```

### 4. Conectar o Expo Go

- Abra o app Expo Go no seu celular
- Escaneie o QR code
- Certifique-se que o celular está na mesma rede Wi-Fi do PC

## 🗄️ Banco de Dados

### Conexão PostgreSQL

- **Host**: trampo4-0-chocolatim3-473c.i.aivencloud.com
- **Porta**: 20697
- **Database**: defaultdb
- **SSL**: Obrigatório

### Tabelas Criadas Automaticamente

- **users**: id, name, matricula, created_at
- **quiz_results**: id, user_id, category_id, category_name, score, total_questions, completed_at

## 🔧 Arquitetura

### Componentes Principais

- **API Server** (`/api/server.js`): Express.js + PostgreSQL
- **Database Service** (`/src/services/database.ts`): Cliente HTTP para API
- **Register Screen** (`/src/app/register.tsx`): Tela de cadastro
- **Ranking Screen** (`/src/app/ranking.tsx`): Exibição do ranking
- **Quiz Integration**: Salvamento automático de resultados

### Por que essa Arquitetura?

- **Expo Go Limitação**: Não suporta clientes PostgreSQL nativos
- **Solução**: API intermediária rodando no PC
- **Vantagem**: Banco real na nuvem + compatibilidade total com Expo Go

## 🎮 Como Testar

1. **Primeira execução**: App vai para tela de registro
2. **Cadastre-se**: Nome + matrícula (salvo no banco)
3. **Faça um quiz**: Resultado salvo automaticamente
4. **Veja o ranking**: Menu > Ranking (dados em tempo real)
5. **Teste com outros usuários**: Cadastre mais pessoas para ver o ranking

## 🌐 Endpoints da API

- `GET /api/health` - Status da API
- `POST /api/users` - Criar usuário
- `GET /api/users/:matricula` - Buscar usuário
- `POST /api/quiz-results` - Salvar resultado
- `GET /api/ranking` - Obter ranking
- `GET /api/users/:id/history` - Histórico do usuário

## 🔍 Troubleshooting

### App não conecta à API

1. Verifique se o servidor está rodando (`node server.js`)
2. Confirme o IP correto no `database.ts`
3. Certifique-se que celular e PC estão na mesma rede

### Erro de certificado SSL

- É normal no desenvolvimento
- A API funciona mesmo com o warning

### Ranking não aparece

- Faça pelo menos um quiz primeiro
- Verifique a conexão com a API

---

## 🎉 Pronto para Usar!

O sistema está completamente funcional:

- ✅ Registro de usuários
- ✅ Banco PostgreSQL na nuvem
- ✅ Sistema de ranking
- ✅ Compatível com Expo Go
- ✅ Dados persistentes

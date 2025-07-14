# 📱 Trampo 4.0 - O Trabalho na Era Digital

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.74-blue?style=for-the-badge&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-51.0-black?style=for-the-badge&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-Academic-green?style=for-the-badge" alt="License" />
</div>

## 📖 Sobre o Projeto

**Trampo 4.0** é um aplicativo educacional desenvolvido para smartphones que explora as transformações do trabalho na era da Indústria 4.0, com foco especial na "uberização" das relações trabalhistas. O app oferece uma experiência interativa e reflexiva sobre como as tecnologias digitais estão redefinindo o mundo do trabalho.

### 🎓 Contexto Acadêmico

- **Disciplina**: TRABALHO E SOCIABILIDADE
- **Instituição**: Universidade Federal do Rio Grande do Norte (UFRN)
- **Professora**: Tassia Rejane Monte dos Santos
- **Tipo**: Trabalho acadêmico sem fins lucrativos

## ✨ Funcionalidades

### 🏠 **Tela Principal (Home)**

- Interface moderna com logo e título do aplicativo
- Menu com 6 opções de navegação organizadas em cards coloridos
- Design responsivo e intuitivo

### 💰 **Simulador de Trabalho**

- **Tipos de serviço**: Entregador, Motorista, Freelancer, Serviços Gerais
- **Cálculos automáticos**: Renda bruta, custos operacionais e renda líquida
- **Análise financeira**: Valor por hora bruto/líquido e percentual de custos
- **Dicas personalizadas**: Custos típicos para cada categoria profissional
- **Reflexões críticas**: Mensagens sobre a realidade do trabalho sob demanda

### 👥 **Perfis de Trabalhadores**

- **4 perfis reais**: Carlos (Motorista), Ana (Freelancer), João (Entregador), Maria (Serviços Gerais)
- **Informações detalhadas**: Renda, jornada, custos e avaliações
- **Histórias pessoais**: Depoimentos sobre desafios e benefícios
- **Reflexões específicas**: Análises personalizadas para cada perfil profissional

### 🎯 **Quiz Reflexivo (3 Categorias)**

1. **🚗 Uberização** (10 questões)

   - Conceitos fundamentais sobre trabalho em plataformas
   - Características e desafios da uberização
   - Impactos na legislação trabalhista

2. **💻 Trabalho Digital** (10 questões)

   - Definições e ferramentas do trabalho digital
   - Vantagens e desvantagens do trabalho remoto
   - Economia do conhecimento e globalização

3. **🏭 Indústria 4.0** (10 questões)
   - Tecnologias da 4ª Revolução Industrial
   - IoT, IA e automação inteligente
   - Impactos na qualificação profissional

**Recursos do Quiz**:

- Seleção de categoria antes de iniciar
- Explicações detalhadas para cada resposta
- Botão "Avançar" (não passa automaticamente)
- Barra de progresso visual
- Resultado final com reflexão crítica

### 📜 **Linha do Tempo da Indústria 4.0**

- **4 Revoluções Industriais**: Do vapor à era digital
- **Timeline interativa**: Períodos, tecnologias e impactos
- **Foco atual**: Transformações na era da uberização
- **Reflexão final**: Flexibilidade vs. proteção social

### 📚 **Glossário**

- **12 termos técnicos** com definições claras
- **Interface expansível**: Toque para ver a definição
- **Busca integrada**: Localização rápida de termos
- **Dica de estudo**: Orientações pedagógicas

### 🎓 **Créditos do Projeto**

- Informações sobre a disciplina e universidade
- Lista completa dos participantes
- Objetivos pedagógicos do aplicativo
- Nota sobre fins educativos e acadêmicos

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **React Native** 0.74+ - Framework mobile multiplataforma
- **Expo** 51.0+ - Plataforma de desenvolvimento
- **TypeScript** 5.3+ - Tipagem estática
- **Expo Router** - Sistema de navegação tipada

### **Componentes e UI**

- **React Native Components** - View, Text, ScrollView, SafeAreaView
- **Custom Components** - MenuCard, WorkerCard, TimelineItem
- **StyleSheet** - Estilização nativa otimizada

### **Arquitetura**

- **Expo New Architecture** - Performance aprimorada
- **Typed Routes** - Navegação com TypeScript
- **Component-based Architecture** - Reutilização de código
- **Mock Data System** - Dados simulados para fins educativos

## 📱 Compatibilidade

- **📱 iOS**: iPhone e iPad (suporte nativo)
- **🤖 Android**: Smartphones e tablets
- **🌐 Web**: Versão browser (PWA)

## 🚀 Como Executar

### **Pré-requisitos**

```bash
# Node.js 18+ e npm/yarn
node --version
npm --version

# Expo CLI
npm install -g expo-cli
```

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/mwrik123/trabalho-e-sociabilidade.git

# Entre no diretório
cd trabalho-e-sociabilidade

# Instale as dependências
npm install
# ou
yarn install
```

### **Executando o Projeto**

```bash
# Inicie o servidor de desenvolvimento
npm start
# ou
yarn start

# Para executar diretamente em plataformas específicas:
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Navegador web
```

### **Testando no Dispositivo**

1. Instale o app **Expo Go** no seu smartphone
2. Escaneie o QR Code que aparece no terminal
3. O app será carregado automaticamente

## 📂 Estrutura do Projeto

```
trampo4.0/
├── src/
│   ├── app/                    # Telas do aplicativo
│   │   ├── index.tsx          # Tela principal (Home)
│   │   ├── simulator.tsx      # Simulador de trabalho
│   │   ├── profiles.tsx       # Lista de perfis
│   │   ├── worker-detail.tsx  # Detalhes do trabalhador
│   │   ├── quiz.tsx          # Sistema de quiz
│   │   ├── timeline.tsx       # Linha do tempo
│   │   ├── glossary.tsx      # Glossário de termos
│   │   └── credits.tsx       # Créditos do projeto
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── MenuCard.tsx      # Card do menu principal
│   │   ├── WorkerCard.tsx    # Card do perfil de trabalhador
│   │   └── TimelineItem.tsx  # Item da linha do tempo
│   │
│   ├── data/                 # Dados mockados
│   │   └── mockData.ts       # Perfis, quizzes, glossário
│   │
│   └── types/                # Interfaces TypeScript
│       └── index.ts          # Definições de tipos
│
├── assets/                   # Recursos visuais
│   └── images/              # Ícones e imagens
│
├── app.json                 # Configuração do Expo
├── package.json            # Dependências do projeto
└── README.md              # Documentação
```

## 🎯 Objetivos Pedagógicos

### **🎓 Educacionais**

- Compreender as transformações do trabalho na era digital
- Analisar criticamente a "uberização" das relações trabalhistas
- Identificar vantagens e desvantagens do trabalho em plataformas
- Refletir sobre direitos trabalhistas e proteção social

### **💡 Reflexivos**

- Estimular o pensamento crítico sobre economia de plataforma
- Promover discussão sobre flexibilidade vs. precarização
- Conscientizar sobre os impactos da Indústria 4.0 no trabalho
- Desenvolver uma visão mais ampla sobre o futuro do trabalho

### **🔧 Técnicos**

- Aplicar conceitos de desenvolvimento mobile
- Implementar interfaces interativas e educativas
- Utilizar dados reais para simulações financeiras
- Criar experiências de usuário engajantes

## 👨‍🎓 Equipe de Desenvolvimento

<table>
  <tr>
    <td align="center">
      <b>Allyson Gustavo Silva do Carmo</b><br>
      <sub>Desenvolvimento e Coordenação</sub>
    </td>
    <td align="center">
      <b>Arthur Nicacio da Silva</b><br>
      <sub>Pesquisa e Conteúdo</sub>
    </td>
    <td align="center">
      <b>Marina Ester Onofre Lopes</b><br>
      <sub>Design e UX</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Livia Maria Silva Queiroz</b><br>
      <sub>Análise e Dados</sub>
    </td>
    <td align="center">
      <b>Ana Beatriz Fraga de Farias</b><br>
      <sub>Conteúdo Educativo</sub>
    </td>
    <td></td>
  </tr>
</table>

## 📊 Dados e Estatísticas

### **💼 Perfis de Trabalhadores**

- **4 perfis reais** baseados em pesquisas de mercado
- **Dados financeiros atualizados** para 2024/2025
- **Cálculos precisos** de valor/hora e custos operacionais
- **Reflexões específicas** para cada categoria profissional

### **📈 Simulador Financeiro**

- **Valores de mercado realísticos** por tipo de serviço
- **Cálculos automáticos** considerando 4,33 semanas/mês
- **Análise de viabilidade** com alertas para custos altos
- **Dicas práticas** sobre custos típicos por categoria

### **🎯 Sistema de Avaliação**

- **30 questões** distribuídas em 3 categorias
- **Explicações detalhadas** para cada resposta
- **Progresso visual** e navegação intuitiva
- **Reflexões finais** conectando teoria e prática

## 🔍 Conceitos Abordados

### **📱 Uberização**

- Definição e características
- Trabalho sob demanda
- Flexibilidade vs. precarização
- Impactos na legislação trabalhista
- Transferência de custos e riscos

### **💻 Trabalho Digital**

- Ferramentas e plataformas
- Trabalho remoto e híbrido
- Economia do conhecimento
- Desafios de conectividade
- Isolamento social e jornada

### **🏭 Indústria 4.0**

- IoT e conectividade
- Inteligência artificial
- Automação inteligente
- Manufatura aditiva (impressão 3D)
- Gêmeos digitais (digital twins)

## 📄 Licença e Uso

Este projeto foi desenvolvido exclusivamente para **fins educativos e acadêmicos**.

**Condições de uso**:

- ✅ Uso educativo e de pesquisa
- ✅ Compartilhamento com atribuição
- ✅ Modificação para fins acadêmicos
- ❌ Uso comercial
- ❌ Distribuição sem créditos

## 🤝 Contribuições

Este é um projeto acadêmico fechado, mas sugestões e feedback são bem-vindos:

1. Abra uma **Issue** para reportar bugs ou sugerir melhorias
2. Envie um **Pull Request** com correções ou funcionalidades
3. Entre em contato com a equipe para discussões acadêmicas

## 📞 Contato

Para questões acadêmicas ou técnicas sobre o projeto:

- **Disciplina**: TRABALHO E SOCIABILIDADE - UFRN
- **Professora**: Tassia Rejane Monte dos Santos
- **Repositório**: [trabalho-e-sociabilidade](https://github.com/mwrik123/trabalho-e-sociabilidade)
- **Equipe**: Ver seção "Créditos" no aplicativo

---

<div align="center">
  <p><strong>📱 Trampo 4.0 - Educação sobre o Futuro do Trabalho</strong></p>
  <p><em>Projeto desenvolvido com 💚 pela equipe da UFRN</em></p>
  <p><sub>© 2024-2025 - Fins Educativos e Acadêmicos</sub></p>
</div>

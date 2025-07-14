import {
  ServiceType,
  WorkerProfile,
  TimelineEvent,
  QuizQuestion,
  QuizCategory,
  GlossaryTerm,
} from "../types";

export const serviceTypes: ServiceType[] = [
  { id: "1", name: "Entregador", icon: "🛵" },
  { id: "2", name: "Motorista", icon: "🚗" },
  { id: "3", name: "Freelancer", icon: "💻" },
  { id: "4", name: "Serviços Gerais", icon: "🔧" },
];

export const workerProfiles: WorkerProfile[] = [
  {
    id: "1",
    name: "Carlos Silva",
    avatar: "👨‍💼",
    serviceType: serviceTypes[1], // Motorista
    rating: 4.8,
    description:
      "Trabalho como motorista desde 2021. Faço em média 10 corridas por dia. Não tenho direito a férias, mas gosto da flexibilidade. Meu maior desafio é o custo do combustível.",
    monthlyIncome: 3200, // Atualizado: R$ 3200 ÷ 180h = R$ 17,78/h
    weeklyHours: 45,
    costs: 1200, // Combustível R$ 800 + manutenção R$ 300 + seguro R$ 100 = 37,5% da renda
    benefits: [],
  },
  {
    id: "2",
    name: "Ana Santos",
    avatar: "👩‍💻",
    serviceType: serviceTypes[2], // Freelancer
    rating: 4.9,
    description:
      "Sou designer freelancer há 3 anos. Trabalho para várias empresas ao mesmo tempo. A renda varia muito, mas tenho autonomia para escolher meus projetos.",
    monthlyIncome: 4500, // Atualizado: R$ 4500 ÷ 140h = R$ 32,14/h
    weeklyHours: 35,
    costs: 600, // Internet R$ 150 + software R$ 300 + equipamentos R$ 150 = 13,3% da renda
    benefits: [],
  },
  {
    id: "3",
    name: "João Oliveira",
    avatar: "👨‍🍳",
    serviceType: serviceTypes[0], // Entregador
    rating: 4.6,
    description:
      "Entregador de comida há 2 anos. Trabalho principalmente nos fins de semana. Uso minha própria moto e pago a manutenção. Não tenho plano de saúde.",
    monthlyIncome: 2200, // Atualizado: R$ 2200 ÷ 100h = R$ 22/h
    weeklyHours: 25,
    costs: 500, // Combustível R$ 300 + manutenção R$ 150 + bag R$ 50 = 22,7% da renda
    benefits: [],
  },
  {
    id: "4",
    name: "Maria Costa",
    avatar: "👩‍🔧",
    serviceType: serviceTypes[3], // Serviços Gerais
    rating: 4.7,
    description:
      "Faço faxinas e serviços domésticos através de aplicativos. Levo meus próprios produtos de limpeza. A demanda varia muito durante o mês.",
    monthlyIncome: 2400, // Atualizado: R$ 2400 ÷ 120h = R$ 20/h
    weeklyHours: 30,
    costs: 350, // Transporte R$ 200 + produtos R$ 100 + equipamentos R$ 50 = 14,6% da renda
    benefits: [],
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "1ª Revolução Industrial",
    period: "1760-1840",
    description:
      "Introdução da máquina a vapor e mecanização da produção têxtil.",
    icon: "⚙️",
  },
  {
    id: "2",
    title: "2ª Revolução Industrial",
    period: "1870-1914",
    description: "Eletricidade, linha de produção e produção em massa.",
    icon: "⚡",
  },
  {
    id: "3",
    title: "3ª Revolução Industrial",
    period: "1950-2000",
    description: "Computadores, automação e tecnologia da informação.",
    icon: "💻",
  },
  {
    id: "4",
    title: "4ª Revolução Industrial",
    period: "2000-presente",
    description:
      "Internet das Coisas, Inteligência Artificial, trabalho digital e uberização.",
    icon: "🤖",
  },
];

export const quizCategories: QuizCategory[] = [
  {
    id: "1",
    title: "Uberização",
    description:
      "Quiz sobre o modelo de trabalho baseado em plataformas digitais",
    icon: "🚗",
    questions: [
      {
        id: "1",
        question: 'O que é "Uberização" do trabalho?',
        options: [
          "A compra de carros pela Uber",
          "O uso de aplicativos apenas para mobilidade urbana",
          "Um modelo de trabalho baseado em plataformas digitais",
          "A substituição total de empregos formais por máquinas",
        ],
        correctAnswer: 2,
        explanation:
          "A uberização refere-se ao modelo de trabalho onde plataformas digitais intermediam serviços, transferindo riscos e custos para os trabalhadores.",
      },
      {
        id: "2",
        question: "Qual das opções abaixo é uma característica da Uberização?",
        options: [
          "Estabilidade trabalhista",
          "Salário fixo mensal",
          "Vínculo empregatício com direitos garantidos",
          "Flexibilidade e trabalho sob demanda",
        ],
        correctAnswer: 3,
        explanation:
          "A uberização é caracterizada pela flexibilidade de horários e trabalho sob demanda, mas sem garantias trabalhistas tradicionais.",
      },
      {
        id: "3",
        question:
          "Qual categoria profissional foi mais impactada inicialmente pela Uberização?",
        options: [
          "Advogados",
          "Motoristas e entregadores",
          "Médicos",
          "Professores universitários",
        ],
        correctAnswer: 1,
        explanation:
          "Motoristas e entregadores foram os primeiros a serem massivamente impactados pela uberização através de aplicativos como Uber e iFood.",
      },
      {
        id: "4",
        question: "A Uberização está relacionada principalmente com:",
        options: [
          "A expansão da agricultura digital",
          "O uso de plataformas digitais para intermediar serviços",
          "A criação de sindicatos modernos",
          "A robotização do trabalho industrial",
        ],
        correctAnswer: 1,
        explanation:
          "A uberização é fundamentalmente sobre o uso de plataformas digitais para conectar prestadores de serviços com consumidores.",
      },
      {
        id: "5",
        question: "Um dos principais problemas apontados na Uberização é:",
        options: [
          "Baixo número de trabalhadores",
          "Pouca demanda por serviços",
          "Ausência de direitos trabalhistas tradicionais",
          "Impossibilidade de acesso à internet",
        ],
        correctAnswer: 2,
        explanation:
          "A principal crítica à uberização é a falta de proteções trabalhistas como férias, 13º salário, FGTS e plano de saúde.",
      },
      {
        id: "6",
        question:
          'O que significa dizer que um trabalhador uberizado é "empreendedor de si mesmo"?',
        options: [
          "Ele comanda uma empresa com funcionários",
          "Ele depende de plataformas, mas sem vínculo empregatício",
          "Ele tem direito a férias e 13º salário",
          "Ele trabalha apenas como voluntário",
        ],
        correctAnswer: 1,
        explanation:
          "O trabalhador uberizado assume riscos empresariais (custos, equipamentos) mas permanece dependente das plataformas, sem vínculo formal.",
      },
      {
        id: "7",
        question:
          "Qual conceito está diretamente ligado à lógica da Uberização do trabalho?",
        options: [
          "Trabalho fordista",
          "Contrato CLT tradicional",
          "Economia de plataforma",
          "Função pública",
        ],
        correctAnswer: 2,
        explanation:
          "A economia de plataforma é o modelo econômico que sustenta a uberização, onde plataformas digitais facilitam transações.",
      },
      {
        id: "8",
        question:
          "Em relação aos direitos trabalhistas, a Uberização pode levar a:",
        options: [
          "Fortalecimento de vínculos sindicais",
          "Consolidação da jornada de 8 horas",
          "Maior formalização do emprego",
          "Precarização das condições de trabalho",
        ],
        correctAnswer: 3,
        explanation:
          "A uberização frequentemente resulta em precarização, com perda de direitos trabalhistas e proteções sociais.",
      },
      {
        id: "9",
        question:
          "Uma crítica comum à Uberização é que ela transfere para o trabalhador:",
        options: [
          "A responsabilidade pelo lucro da empresa",
          "Os custos de operação e riscos do negócio",
          "A definição de preços e salários mínimos",
          "A gestão de todas as plataformas digitais existentes",
        ],
        correctAnswer: 1,
        explanation:
          "Na uberização, custos como combustível, manutenção, equipamentos e seguros são transferidos para o trabalhador.",
      },
      {
        id: "10",
        question:
          "Em termos de legislação, o principal desafio da Uberização é:",
        options: [
          "Criar aplicativos mais rápidos",
          "Reduzir a carga tributária sobre plataformas",
          "Regular novas formas de trabalho fora da CLT",
          "Limitar o número de motoristas nas cidades",
        ],
        correctAnswer: 2,
        explanation:
          "O maior desafio legislativo é criar regulamentações para essas novas formas de trabalho que não se encaixam na CLT tradicional.",
      },
    ],
  },
  {
    id: "2",
    title: "Trabalho Digital",
    description: "Quiz sobre as transformações do trabalho na era digital",
    icon: "💻",
    questions: [
      {
        id: "1",
        question: "O que é trabalho digital?",
        options: [
          "Trabalho feito somente com papel e caneta",
          "Trabalho manual realizado em fábricas",
          "Atividades realizadas com apoio de tecnologias digitais",
          "Qualquer tipo de trabalho doméstico",
        ],
        correctAnswer: 2,
        explanation:
          "Trabalho digital são atividades profissionais que utilizam tecnologias digitais como ferramentas principais para sua execução.",
      },
      {
        id: "2",
        question: "Um exemplo comum de trabalho digital é:",
        options: [
          "Operar um trator agrícola",
          "Trabalhar como pedreiro",
          "Atuar como influenciador em redes sociais",
          "Atuar como cobrador de ônibus",
        ],
        correctAnswer: 2,
        explanation:
          "Influenciadores digitais são um exemplo clássico de trabalho digital, usando plataformas online como ferramenta de trabalho.",
      },
      {
        id: "3",
        question: "Qual ferramenta é essencial para o trabalho digital?",
        options: [
          "Chave de fenda",
          "Máquina de escrever",
          "Conexão com a internet",
          "Calculadora de bolso",
        ],
        correctAnswer: 2,
        explanation:
          "A conexão com a internet é fundamental para o trabalho digital, permitindo acesso a ferramentas, comunicação e colaboração online.",
      },
      {
        id: "4",
        question: "O trabalho digital pode ser realizado de forma:",
        options: [
          "Apenas presencial",
          "Apenas em fábricas",
          "Remota ou híbrida, com uso de tecnologias",
          "Somente por maiores de 50 anos",
        ],
        correctAnswer: 2,
        explanation:
          "O trabalho digital permite flexibilidade geográfica, podendo ser realizado remotamente ou de forma híbrida usando tecnologias.",
      },
      {
        id: "5",
        question: "Uma plataforma que permite o trabalho digital é:",
        options: ["Uber", "Canva", "WordPress", "Todas as anteriores"],
        correctAnswer: 3,
        explanation:
          "Todas essas plataformas permitem diferentes tipos de trabalho digital: transporte, design e criação de conteúdo respectivamente.",
      },
      {
        id: "6",
        question: "O que diferencia o trabalho digital do tradicional?",
        options: [
          "Requer mais esforço físico",
          "Depende exclusivamente de máquinas pesadas",
          "Utiliza ferramentas digitais e flexibilidade geográfica",
          "Tem mais estabilidade e garantias trabalhistas",
        ],
        correctAnswer: 2,
        explanation:
          "O trabalho digital se diferencia pelo uso de ferramentas digitais e pela possibilidade de flexibilidade de local e horário.",
      },
      {
        id: "7",
        question: "Uma consequência negativa do trabalho digital pode ser:",
        options: [
          "Redução da desigualdade social",
          "Aumento da formalização trabalhista",
          "Isolamento social e excesso de jornada",
          "Garantia de 13º salário a todos",
        ],
        correctAnswer: 2,
        explanation:
          "O trabalho digital pode levar ao isolamento social e à dificuldade de separar vida pessoal e profissional, causando excesso de jornada.",
      },
      {
        id: "8",
        question: "Qual setor mais cresce com o avanço do trabalho digital?",
        options: [
          "Construção civil",
          "Indústria têxtil",
          "Tecnologia da informação",
          "Mineração",
        ],
        correctAnswer: 2,
        explanation:
          "O setor de tecnologia da informação é o que mais cresce com o trabalho digital, incluindo desenvolvimento, design e marketing digital.",
      },
      {
        id: "9",
        question: "Um desafio enfrentado por trabalhadores digitais é:",
        options: [
          "Falta de conectividade e infraestrutura adequada",
          "Excesso de reuniões presenciais",
          "Pouca interação com tecnologias",
          "Altos salários garantidos por lei",
        ],
        correctAnswer: 0,
        explanation:
          "A falta de infraestrutura digital adequada, como internet de qualidade, é um dos principais desafios para trabalhadores digitais.",
      },
      {
        id: "10",
        question: "O trabalho digital está associado à:",
        options: [
          "Impossibilidade de controle de produtividade",
          "Economia agrícola e rural",
          "Economia do conhecimento e globalização",
          "Exclusão do uso de redes sociais",
        ],
        correctAnswer: 2,
        explanation:
          "O trabalho digital está intrinsecamente ligado à economia do conhecimento e aos processos de globalização facilitados pela tecnologia.",
      },
    ],
  },
  {
    id: "3",
    title: "Indústria 4.0",
    description: "Quiz sobre a Quarta Revolução Industrial e suas tecnologias",
    icon: "🏭",
    questions: [
      {
        id: "1",
        question: "O que é a Indústria 4.0?",
        options: [
          "Uma fábrica com mais operários",
          "A 4ª Revolução Industrial baseada em tecnologias digitais",
          "Um modelo antigo de produção em massa",
          "Um tipo de indústria rural",
        ],
        correctAnswer: 1,
        explanation:
          "A Indústria 4.0 representa a 4ª Revolução Industrial, caracterizada pela integração de tecnologias digitais avançadas nos processos industriais.",
      },
      {
        id: "2",
        question:
          "Qual das tecnologias abaixo está diretamente ligada à Indústria 4.0?",
        options: [
          "Telégrafo",
          "Impressora matricial",
          "Internet das Coisas (IoT)",
          "Esteira de produção manual",
        ],
        correctAnswer: 2,
        explanation:
          "A Internet das Coisas (IoT) é uma das tecnologias fundamentais da Indústria 4.0, permitindo conectividade entre máquinas e sistemas.",
      },
      {
        id: "3",
        question: "Uma das principais características da Indústria 4.0 é:",
        options: [
          "Substituição de todos os computadores por humanos",
          "Produção totalmente analógica",
          "Integração entre máquinas, dados e inteligência artificial",
          "Foco exclusivo em produtos agrícolas",
        ],
        correctAnswer: 2,
        explanation:
          "A Indústria 4.0 é caracterizada pela integração inteligente entre máquinas, análise de dados e inteligência artificial para otimizar processos.",
      },
      {
        id: "4",
        question: "Qual das opções é um benefício da Indústria 4.0?",
        options: [
          "Redução de conectividade entre setores",
          "Aumento de erros manuais",
          "Maior personalização da produção em massa",
          "Exclusão total de operadores humanos",
        ],
        correctAnswer: 2,
        explanation:
          "A Indústria 4.0 permite maior personalização da produção em massa através de tecnologias flexíveis e sistemas adaptativos.",
      },
      {
        id: "5",
        question:
          "A automação inteligente, típica da Indústria 4.0, depende principalmente de:",
        options: [
          "Ferrovias industriais",
          "Energia hidráulica",
          "Sensores, algoritmos e conectividade em tempo real",
          "Trabalhadores com pouca formação",
        ],
        correctAnswer: 2,
        explanation:
          "A automação inteligente da Indústria 4.0 baseia-se em sensores avançados, algoritmos de IA e conectividade em tempo real.",
      },
      {
        id: "6",
        question:
          "A manufatura aditiva, aplicada na Indústria 4.0, refere-se a:",
        options: [
          "Reciclagem de peças metálicas",
          "Uso de máquinas antigas",
          "Impressão 3D de peças e componentes",
          "Substituição de softwares por hardware",
        ],
        correctAnswer: 2,
        explanation:
          "A manufatura aditiva refere-se à impressão 3D, uma tecnologia que permite criar peças complexas camada por camada.",
      },
      {
        id: "7",
        question:
          'O conceito de "gêmeo digital" (digital twin) na Indústria 4.0 é:',
        options: [
          "Um programa que bloqueia redes sociais",
          "A cópia física de uma máquina",
          "Uma réplica virtual de sistemas físicos para simulações",
          "Um software que cria irmãos robóticos",
        ],
        correctAnswer: 2,
        explanation:
          "O gêmeo digital é uma réplica virtual em tempo real de sistemas físicos, permitindo simulações e otimizações antes da implementação real.",
      },
      {
        id: "8",
        question:
          "A Indústria 4.0 contribui para a sustentabilidade por meio de:",
        options: [
          "Aumento do descarte de resíduos industriais",
          "Redução da automação de processos",
          "Otimização do uso de recursos e redução de desperdício",
          "Interrupção da coleta de dados ambientais",
        ],
        correctAnswer: 2,
        explanation:
          "A Indústria 4.0 promove sustentabilidade através da otimização inteligente de recursos, reduzindo desperdícios e melhorando eficiência energética.",
      },
      {
        id: "9",
        question: "Qual desses é um desafio da implementação da Indústria 4.0?",
        options: [
          "Excesso de trabalhadores disponíveis",
          "Alta conectividade rural",
          "Custo elevado para pequenas empresas e falta de qualificação",
          "Pouca oferta de sensores e dispositivos inteligentes no mercado",
        ],
        correctAnswer: 2,
        explanation:
          "Os principais desafios incluem altos custos de implementação para pequenas empresas e a necessidade de qualificação dos trabalhadores.",
      },
      {
        id: "10",
        question:
          "A Indústria 4.0 transforma o papel dos trabalhadores ao exigir:",
        options: [
          "Apenas força física",
          "Menor nível de escolaridade",
          "Novas habilidades digitais, analíticas e técnicas",
          "Exclusiva atuação no chão de fábrica",
        ],
        correctAnswer: 2,
        explanation:
          "A Indústria 4.0 exige dos trabalhadores novas competências digitais, capacidade analítica e habilidades técnicas para interagir com sistemas inteligentes.",
      },
    ],
  },
];

// Manter compatibilidade com código existente
export const quizQuestions: QuizQuestion[] = quizCategories[0].questions;

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "Uberização",
    definition:
      "Modelo de trabalho que transfere custos e riscos da empresa para o trabalhador, intermediado por plataformas digitais.",
  },
  {
    id: "2",
    term: "Indústria 4.0",
    definition:
      "Quarta revolução industrial caracterizada pela digitalização, automação, IoT e inteligência artificial.",
  },
  {
    id: "3",
    term: "Gig Economy",
    definition:
      "Economia baseada em trabalhos temporários e freelancers, sem vínculos empregatícios tradicionais.",
  },
  {
    id: "4",
    term: "Algoritmo de Controle",
    definition:
      "Sistema automatizado que monitora, avalia e distribui trabalho para trabalhadores digitais.",
  },
  {
    id: "5",
    term: "Flexibilização",
    definition:
      "Processo de redução das proteções trabalhistas em nome da adaptabilidade do mercado.",
  },
  {
    id: "6",
    term: "Trabalhador Sob Demanda",
    definition:
      "Profissional que trabalha apenas quando há demanda, sem garantias de renda ou horários fixos.",
  },
];

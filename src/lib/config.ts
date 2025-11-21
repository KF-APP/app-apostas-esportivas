export const APP_CONFIG = {
  name: 'BetSmart Pro',
  version: '1.0.0',
  description: 'Sugestões Inteligentes de Apostas Esportivas',
  author: 'BetSmart Team',
  
  // Configurações da API
  api: {
    maxRequestsPerMinute: 30,
    cacheTime: 300, // 5 minutos em segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo
  },
  
  // Configurações de análise
  analysis: {
    minMatchesForAnalysis: 5,
    h2hMatchesLimit: 10,
    teamLastMatchesLimit: 10,
    confidenceThresholds: {
      conservative: 70,
      medium: 60,
      high: 50,
    },
  },
  
  // Configurações de UI
  ui: {
    resultsRetentionDays: 30,
    autoRefreshInterval: 60000, // 1 minuto
    toastDuration: 3000,
  },
  
  // Ligas prioritárias
  priorityLeagues: [
    39,  // Premier League
    140, // La Liga
    78,  // Bundesliga
    135, // Serie A
    61,  // Ligue 1
    2,   // UEFA Champions League
    3,   // UEFA Europa League
    71,  // Brasileirão Série A
    128, // Liga Argentina
    253, // MLS
  ],
  
  // Links úteis
  links: {
    apiFootball: 'https://www.api-football.com/',
    documentation: 'https://www.api-football.com/documentation-v3',
    support: 'mailto:support@betsmart.com',
  },
};

export const RISK_LEVELS = {
  conservative: {
    label: 'Conservador',
    color: 'emerald',
    minConfidence: 70,
    description: 'Apostas mais seguras com maior probabilidade de acerto',
  },
  medium: {
    label: 'Médio',
    color: 'yellow',
    minConfidence: 60,
    description: 'Equilíbrio entre risco e retorno',
  },
  high: {
    label: 'Alto Risco',
    color: 'red',
    minConfidence: 50,
    description: 'Apostas ousadas com maior potencial de retorno',
  },
} as const;

export const BET_TYPES = {
  over_under: {
    label: 'Over/Under',
    description: 'Total de gols na partida',
    icon: 'target',
  },
  both_teams_score: {
    label: 'Ambas Marcam',
    description: 'Se ambos times marcarão',
    icon: 'users',
  },
  match_winner: {
    label: 'Resultado',
    description: 'Vencedor da partida',
    icon: 'trophy',
  },
  correct_score: {
    label: 'Placar Exato',
    description: 'Placar final da partida',
    icon: 'hash',
  },
  corners: {
    label: 'Escanteios',
    description: 'Total de escanteios',
    icon: 'flag',
  },
} as const;

export const ERROR_MESSAGES = {
  apiKeyMissing: 'Chave da API não configurada. Adicione NEXT_PUBLIC_FOOTBALL_API_KEY no arquivo .env.local',
  rateLimitExceeded: 'Limite de requisições excedido. Aguarde um momento.',
  networkError: 'Erro de conexão. Verifique sua internet.',
  noDataAvailable: 'Dados insuficientes para análise.',
  invalidFixture: 'Jogo inválido ou não encontrado.',
} as const;

export const SUCCESS_MESSAGES = {
  dataLoaded: 'Dados carregados com sucesso!',
  analysisComplete: 'Análise concluída!',
  predictionSaved: 'Previsão salva com sucesso!',
} as const;

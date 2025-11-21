export type RiskLevel = 'conservative' | 'medium' | 'high';
export type BetType = 'over_under' | 'btts' | 'corners' | 'result';

export interface BetSuggestion {
  id: string;
  fixtureId: number;
  type: BetType;
  riskLevel: RiskLevel;
  description: string;
  odds: number;
  confidence: number; // 0-100
  reasoning: string;
  prediction: string;
}

export interface MatchAnalysis {
  fixtureId: number;
  homeTeam: {
    name: string;
    form: string;
    goalsScored: number;
    goalsConceded: number;
    avgGoalsScored: number;
    avgGoalsConceded: number;
  };
  awayTeam: {
    name: string;
    form: string;
    goalsScored: number;
    goalsConceded: number;
    avgGoalsScored: number;
    avgGoalsConceded: number;
  };
  h2h: {
    totalMatches: number;
    homeWins: number;
    awayWins: number;
    draws: number;
    avgGoals: number;
  };
}

export interface PredictionResult {
  fixtureId: number;
  suggestions: BetSuggestion[];
  status: 'pending' | 'won' | 'lost' | 'void';
  result?: {
    homeGoals: number;
    awayGoals: number;
    corners?: number;
  };
  date: string;
}

// Função para analisar partida e gerar sugestões
export function generateBetSuggestions(analysis: MatchAnalysis): BetSuggestion[] {
  const suggestions: BetSuggestion[] = [];
  
  const totalAvgGoals = analysis.homeTeam.avgGoalsScored + analysis.awayTeam.avgGoalsScored;
  const defensiveStrength = (analysis.homeTeam.avgGoalsConceded + analysis.awayTeam.avgGoalsConceded) / 2;
  
  // Over/Under 2.5 Gols
  if (totalAvgGoals > 2.8) {
    suggestions.push({
      id: `${analysis.fixtureId}-over25-conservative`,
      fixtureId: analysis.fixtureId,
      type: 'over_under',
      riskLevel: 'conservative',
      description: 'Over 2.5 Gols',
      odds: 1.75,
      confidence: 75,
      reasoning: `Média de ${totalAvgGoals.toFixed(1)} gols por jogo. Ambos times com ataque forte.`,
      prediction: 'Over 2.5',
    });
  } else if (totalAvgGoals < 2.0 && defensiveStrength < 1.5) {
    suggestions.push({
      id: `${analysis.fixtureId}-under25-conservative`,
      fixtureId: analysis.fixtureId,
      type: 'over_under',
      riskLevel: 'conservative',
      description: 'Under 2.5 Gols',
      odds: 1.65,
      confidence: 70,
      reasoning: `Média baixa de ${totalAvgGoals.toFixed(1)} gols. Defesas sólidas.`,
      prediction: 'Under 2.5',
    });
  }
  
  // Over 3.5 (Risco Médio)
  if (totalAvgGoals > 3.2) {
    suggestions.push({
      id: `${analysis.fixtureId}-over35-medium`,
      fixtureId: analysis.fixtureId,
      type: 'over_under',
      riskLevel: 'medium',
      description: 'Over 3.5 Gols',
      odds: 2.40,
      confidence: 60,
      reasoning: `Jogos com média muito alta de gols (${totalAvgGoals.toFixed(1)}).`,
      prediction: 'Over 3.5',
    });
  }
  
  // Ambas Marcam (BTTS)
  const bothScore = analysis.homeTeam.goalsScored > 0 && analysis.awayTeam.goalsScored > 0;
  const bothConcede = analysis.homeTeam.goalsConceded > 0 && analysis.awayTeam.goalsConceded > 0;
  
  if (bothScore && bothConcede && totalAvgGoals > 2.3) {
    suggestions.push({
      id: `${analysis.fixtureId}-btts-medium`,
      fixtureId: analysis.fixtureId,
      type: 'btts',
      riskLevel: 'medium',
      description: 'Ambas Marcam (Sim)',
      odds: 1.85,
      confidence: 65,
      reasoning: `Ambos times marcaram e sofreram gols recentemente. Ataques produtivos.`,
      prediction: 'Sim',
    });
  }
  
  // Escanteios Over 9.5 (Risco Alto)
  if (totalAvgGoals > 2.5) {
    suggestions.push({
      id: `${analysis.fixtureId}-corners-high`,
      fixtureId: analysis.fixtureId,
      type: 'corners',
      riskLevel: 'high',
      description: 'Over 9.5 Escanteios',
      odds: 1.90,
      confidence: 55,
      reasoning: 'Jogos ofensivos tendem a gerar mais escanteios.',
      prediction: 'Over 9.5',
    });
  }
  
  // Resultado (Risco Alto)
  const homeFormPoints = calculateFormPoints(analysis.homeTeam.form);
  const awayFormPoints = calculateFormPoints(analysis.awayTeam.form);
  
  if (homeFormPoints - awayFormPoints >= 6) {
    suggestions.push({
      id: `${analysis.fixtureId}-result-high`,
      fixtureId: analysis.fixtureId,
      type: 'result',
      riskLevel: 'high',
      description: 'Vitória do Mandante',
      odds: 2.10,
      confidence: 58,
      reasoning: `${analysis.homeTeam.name} em forma superior (${analysis.homeTeam.form} vs ${analysis.awayTeam.form})`,
      prediction: 'Casa',
    });
  } else if (awayFormPoints - homeFormPoints >= 6) {
    suggestions.push({
      id: `${analysis.fixtureId}-result-high`,
      fixtureId: analysis.fixtureId,
      type: 'result',
      riskLevel: 'high',
      description: 'Vitória do Visitante',
      odds: 2.80,
      confidence: 55,
      reasoning: `${analysis.awayTeam.name} em forma superior (${analysis.awayTeam.form} vs ${analysis.homeTeam.form})`,
      prediction: 'Fora',
    });
  }
  
  return suggestions;
}

function calculateFormPoints(form: string): number {
  let points = 0;
  for (const char of form) {
    if (char === 'W' || char === 'V') points += 3;
    else if (char === 'D' || char === 'E') points += 1;
  }
  return points;
}

// Salvar resultado no localStorage
export function savePredictionResult(result: PredictionResult) {
  const results = getPredictionResults();
  const existing = results.findIndex(r => r.fixtureId === result.fixtureId);
  
  if (existing >= 0) {
    results[existing] = result;
  } else {
    results.push(result);
  }
  
  // Manter apenas últimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filtered = results.filter(r => new Date(r.date) >= thirtyDaysAgo);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('bet-predictions', JSON.stringify(filtered));
  }
}

export function getPredictionResults(): PredictionResult[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('bet-predictions');
  return data ? JSON.parse(data) : [];
}

export function calculateDashboardStats() {
  const results = getPredictionResults();
  const completed = results.filter(r => r.status === 'won' || r.status === 'lost');
  
  const total = completed.length;
  const won = completed.filter(r => r.status === 'won').length;
  const lost = completed.filter(r => r.status === 'lost').length;
  const winRate = total > 0 ? (won / total) * 100 : 0;
  
  // Stats por nível de risco
  const conservative = completed.filter(r => 
    r.suggestions.some(s => s.riskLevel === 'conservative')
  );
  const medium = completed.filter(r => 
    r.suggestions.some(s => s.riskLevel === 'medium')
  );
  const high = completed.filter(r => 
    r.suggestions.some(s => s.riskLevel === 'high')
  );
  
  return {
    total,
    won,
    lost,
    winRate: winRate.toFixed(1),
    byRisk: {
      conservative: {
        total: conservative.length,
        won: conservative.filter(r => r.status === 'won').length,
        rate: conservative.length > 0 
          ? ((conservative.filter(r => r.status === 'won').length / conservative.length) * 100).toFixed(1)
          : '0',
      },
      medium: {
        total: medium.length,
        won: medium.filter(r => r.status === 'won').length,
        rate: medium.length > 0 
          ? ((medium.filter(r => r.status === 'won').length / medium.length) * 100).toFixed(1)
          : '0',
      },
      high: {
        total: high.length,
        won: high.filter(r => r.status === 'won').length,
        rate: high.length > 0 
          ? ((high.filter(r => r.status === 'won').length / high.length) * 100).toFixed(1)
          : '0',
      },
    },
  };
}

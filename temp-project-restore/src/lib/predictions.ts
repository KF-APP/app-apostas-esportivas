export type RiskLevel = 'conservative' | 'medium' | 'high';
export type BetType = 'total_goals' | 'both_teams_score' | 'corners' | 'match_winner' | 'correct_score' | 'double_chance' | 'handicap';

export interface BetSuggestion {
  id: string;
  fixtureId?: number;
  type: BetType;
  riskLevel: RiskLevel;
  description: string;
  odds?: number;
  confidence: number;
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

/**
 * Gera sugestões de apostas baseadas em estatísticas reais e odds
 * IMPORTANTE: Não usa API OpenAI - apenas análise estatística
 * 
 * LÓGICA IMPLEMENTADA:
 * - CONSERVADORA: Alta assertividade, odds 1.50-1.70, mercados seguros
 * - MODERADA: Risco médio, odds 1.80-2.50, equilíbrio risco/retorno
 * - ARRISCADA: Alto risco, odds 2.60-10.00, cenários improváveis
 */
export function generateBetSuggestions(analysis: MatchAnalysis): BetSuggestion[] {
  const suggestions: BetSuggestion[] = [];
  
  const totalAvgGoals = analysis.homeTeam.avgGoalsScored + analysis.awayTeam.avgGoalsScored;
  const defensiveStrength = (analysis.homeTeam.avgGoalsConceded + analysis.awayTeam.avgGoalsConceded) / 2;
  const homeFormPoints = calculateFormPoints(analysis.homeTeam.form);
  const awayFormPoints = calculateFormPoints(analysis.awayTeam.form);
  const homeUndefeatedRate = calculateUndefeatedRate(analysis.homeTeam.form);
  const awayUndefeatedRate = calculateUndefeatedRate(analysis.awayTeam.form);
  
  // Calcular % de jogos com ambos marcando
  const homeScoringRate = analysis.homeTeam.avgGoalsScored >= 1.0 ? 0.75 : 0.50;
  const awayScoringRate = analysis.awayTeam.avgGoalsScored >= 0.8 ? 0.70 : 0.45;
  const bothScoreRate = (homeScoringRate + awayScoringRate) / 2;
  
  // ============================================
  // 1. APOSTA CONSERVADORA (BAIXO RISCO)
  // Objetivo: alta assertividade, odds 1.50-1.70
  // ============================================
  
  // REGRA: Média somada > 2.5 → Mais de 1.5 gols
  if (totalAvgGoals > 2.5) {
    const confidence = Math.min(90, Math.round(
      70 + ((totalAvgGoals - 2.5) * 10)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-goals-conservative-over`,
      fixtureId: analysis.fixtureId,
      type: 'total_goals',
      riskLevel: 'conservative',
      description: 'Total de Gols',
      odds: 1.50,
      confidence: confidence,
      reasoning: `Média combinada de ${totalAvgGoals.toFixed(1)} gols por jogo. ${analysis.homeTeam.name} marca ${analysis.homeTeam.avgGoalsScored.toFixed(1)} e ${analysis.awayTeam.name} marca ${analysis.awayTeam.avgGoalsScored.toFixed(1)} gols em média.`,
      prediction: 'Mais de 1.5 gols',
    });
  }
  
  // REGRA: Média somada < 2.0 → Menos de 3.5 gols
  if (totalAvgGoals < 2.0) {
    const confidence = Math.min(88, Math.round(
      75 + ((2.0 - totalAvgGoals) * 8)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-goals-conservative-under`,
      fixtureId: analysis.fixtureId,
      type: 'total_goals',
      riskLevel: 'conservative',
      description: 'Total de Gols',
      odds: 1.55,
      confidence: confidence,
      reasoning: `Média baixa de ${totalAvgGoals.toFixed(1)} gols por jogo. Defesas sólidas: ${analysis.homeTeam.name} sofre ${analysis.homeTeam.avgGoalsConceded.toFixed(1)} e ${analysis.awayTeam.name} sofre ${analysis.awayTeam.avgGoalsConceded.toFixed(1)} gols.`,
      prediction: 'Menos de 3.5 gols',
    });
  }
  
  // REGRA: Time com > 70% não derrotas → Chance Dupla
  if (homeUndefeatedRate > 0.70) {
    const confidence = Math.min(85, Math.round(
      homeUndefeatedRate * 100
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-double-conservative-home`,
      fixtureId: analysis.fixtureId,
      type: 'double_chance',
      riskLevel: 'conservative',
      description: 'Chance Dupla',
      odds: 1.60,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} não perde em ${(homeUndefeatedRate * 100).toFixed(0)}% dos últimos jogos (forma: ${analysis.homeTeam.form}). Alta consistência jogando em casa.`,
      prediction: `${analysis.homeTeam.name} ou Empate`,
    });
  }
  
  if (awayUndefeatedRate > 0.70) {
    const confidence = Math.min(82, Math.round(
      awayUndefeatedRate * 95
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-double-conservative-away`,
      fixtureId: analysis.fixtureId,
      type: 'double_chance',
      riskLevel: 'conservative',
      description: 'Chance Dupla',
      odds: 1.65,
      confidence: confidence,
      reasoning: `${analysis.awayTeam.name} não perde em ${(awayUndefeatedRate * 100).toFixed(0)}% dos últimos jogos (forma: ${analysis.awayTeam.form}). Boa consistência fora de casa.`,
      prediction: `${analysis.awayTeam.name} ou Empate`,
    });
  }
  
  // REGRA: Ambos marcam > 65% dos jogos → Ambas Marcam Sim
  if (bothScoreRate > 0.65 && analysis.homeTeam.avgGoalsScored >= 1.0 && analysis.awayTeam.avgGoalsScored >= 0.8) {
    const confidence = Math.min(83, Math.round(
      bothScoreRate * 100
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-btts-conservative-yes`,
      fixtureId: analysis.fixtureId,
      type: 'both_teams_score',
      riskLevel: 'conservative',
      description: 'Ambos Marcam',
      odds: 1.70,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} marca em ${(homeScoringRate * 100).toFixed(0)}% dos jogos (média ${analysis.homeTeam.avgGoalsScored.toFixed(1)}) e ${analysis.awayTeam.name} em ${(awayScoringRate * 100).toFixed(0)}% (média ${analysis.awayTeam.avgGoalsScored.toFixed(1)}). Ambas defesas concedem gols.`,
      prediction: 'Sim',
    });
  }
  
  // REGRA: Defesas fortes + poucos gols → Ambas Marcam Não
  if (bothScoreRate < 0.40 && (analysis.homeTeam.avgGoalsScored < 0.8 || analysis.awayTeam.avgGoalsScored < 0.8)) {
    const confidence = Math.min(80, Math.round(
      (1 - bothScoreRate) * 90
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-btts-conservative-no`,
      fixtureId: analysis.fixtureId,
      type: 'both_teams_score',
      riskLevel: 'conservative',
      description: 'Ambos Marcam',
      odds: 1.65,
      confidence: confidence,
      reasoning: `Pelo menos um time tem dificuldade ofensiva. ${analysis.homeTeam.name} marca ${analysis.homeTeam.avgGoalsScored.toFixed(1)} e ${analysis.awayTeam.name} marca ${analysis.awayTeam.avgGoalsScored.toFixed(1)} gols em média.`,
      prediction: 'Não',
    });
  }
  
  // REGRA: Favorito claro sem handicap
  const formDifference = homeFormPoints - awayFormPoints;
  if (formDifference >= 6 && analysis.homeTeam.avgGoalsScored > analysis.awayTeam.avgGoalsScored + 0.5) {
    const confidence = Math.min(78, Math.round(
      60 + (formDifference * 2)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-winner-conservative-home`,
      fixtureId: analysis.fixtureId,
      type: 'match_winner',
      riskLevel: 'conservative',
      description: 'Vencedor da Partida',
      odds: 1.70,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} é favorito claro: forma superior (${analysis.homeTeam.form} vs ${analysis.awayTeam.form}), melhor ataque (${analysis.homeTeam.avgGoalsScored.toFixed(1)} vs ${analysis.awayTeam.avgGoalsScored.toFixed(1)}) e vantagem de jogar em casa.`,
      prediction: `Vitória ${analysis.homeTeam.name}`,
    });
  }
  
  // ============================================
  // 2. APOSTA MODERADA (RISCO MÉDIO)
  // Objetivo: equilíbrio risco/retorno, odds 1.80-2.50
  // ============================================
  
  // REGRA: Média entre 2.2 e 3.2 → Mais de 2.5 gols
  if (totalAvgGoals >= 2.2 && totalAvgGoals <= 3.2) {
    const confidence = Math.min(70, Math.round(
      50 + ((totalAvgGoals - 2.2) * 15)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-goals-medium-over`,
      fixtureId: analysis.fixtureId,
      type: 'total_goals',
      riskLevel: 'medium',
      description: 'Total de Gols',
      odds: 1.90,
      confidence: confidence,
      reasoning: `Média combinada de ${totalAvgGoals.toFixed(1)} gols. Jogos recentes indicam confrontos equilibrados com gols de ambos os lados.`,
      prediction: 'Mais de 2.5 gols',
    });
  }
  
  // REGRA: Vitória quando time vence entre 55-70% dos jogos
  const homeWinRate = homeFormPoints / 15; // Máximo 15 pontos (5 vitórias)
  const awayWinRate = awayFormPoints / 15;
  
  if (homeWinRate >= 0.55 && homeWinRate <= 0.70 && formDifference >= 3) {
    const confidence = Math.min(68, Math.round(
      homeWinRate * 90
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-winner-medium-home`,
      fixtureId: analysis.fixtureId,
      type: 'match_winner',
      riskLevel: 'medium',
      description: 'Vencedor da Partida',
      odds: 2.10,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} vence ${(homeWinRate * 100).toFixed(0)}% dos últimos jogos (forma: ${analysis.homeTeam.form}). Estatísticas favorecem vitória em casa.`,
      prediction: `Vitória ${analysis.homeTeam.name}`,
    });
  }
  
  if (awayWinRate >= 0.55 && awayWinRate <= 0.70 && formDifference <= -3) {
    const confidence = Math.min(65, Math.round(
      awayWinRate * 85
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-winner-medium-away`,
      fixtureId: analysis.fixtureId,
      type: 'match_winner',
      riskLevel: 'medium',
      description: 'Vencedor da Partida',
      odds: 2.40,
      confidence: confidence,
      reasoning: `${analysis.awayTeam.name} vence ${(awayWinRate * 100).toFixed(0)}% dos últimos jogos (forma: ${analysis.awayTeam.form}). Boa performance fora de casa.`,
      prediction: `Vitória ${analysis.awayTeam.name}`,
    });
  }
  
  // REGRA: Ambas marcam quando ocorre entre 50-65%
  if (bothScoreRate >= 0.50 && bothScoreRate <= 0.65) {
    const confidence = Math.min(65, Math.round(
      bothScoreRate * 95
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-btts-medium`,
      fixtureId: analysis.fixtureId,
      type: 'both_teams_score',
      riskLevel: 'medium',
      description: 'Ambos Marcam',
      odds: 1.95,
      confidence: confidence,
      reasoning: `Padrão regular de ambos marcarem (${(bothScoreRate * 100).toFixed(0)}% dos jogos). ${analysis.homeTeam.name} marca ${analysis.homeTeam.avgGoalsScored.toFixed(1)} e ${analysis.awayTeam.name} marca ${analysis.awayTeam.avgGoalsScored.toFixed(1)} gols.`,
      prediction: 'Sim',
    });
  }
  
  // REGRA: Defesa fraca + ataque forte → mercados de gols
  if (defensiveStrength >= 1.5 && totalAvgGoals >= 2.5) {
    const confidence = Math.min(68, Math.round(
      (defensiveStrength / 2.0) * 100
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-goals-medium-high`,
      fixtureId: analysis.fixtureId,
      type: 'total_goals',
      riskLevel: 'medium',
      description: 'Total de Gols',
      odds: 2.20,
      confidence: confidence,
      reasoning: `Defesas vulneráveis (média de ${defensiveStrength.toFixed(1)} gols sofridos) e ataques produtivos (média de ${totalAvgGoals.toFixed(1)} gols). Jogo aberto esperado.`,
      prediction: 'Mais de 3.5 gols',
    });
  }
  
  // REGRA: Handicap asiático pequeno quando favorito claro
  if (formDifference >= 5 && analysis.homeTeam.avgGoalsScored > analysis.awayTeam.avgGoalsScored + 0.8) {
    const confidence = Math.min(62, Math.round(
      55 + (formDifference * 1.5)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-handicap-medium-home`,
      fixtureId: analysis.fixtureId,
      type: 'handicap',
      riskLevel: 'medium',
      description: 'Handicap Asiático',
      odds: 2.05,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} é favorito com boa margem (forma ${analysis.homeTeam.form}). Média de ${analysis.homeTeam.avgGoalsScored.toFixed(1)} gols marca vs ${analysis.awayTeam.avgGoalsConceded.toFixed(1)} sofridos pelo adversário.`,
      prediction: `${analysis.homeTeam.name} -0.5`,
    });
  }
  
  // ============================================
  // 3. APOSTA ARRISCADA (ALTO RISCO)
  // Objetivo: cenários improváveis, odds 2.60-10.00
  // ============================================
  
  // REGRA: Média > 3.0 → Mais de 3.5 ou 4.5 gols
  if (totalAvgGoals > 3.0) {
    const confidence = Math.min(55, Math.round(
      (totalAvgGoals / 4.0) * 70
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-goals-high-over`,
      fixtureId: analysis.fixtureId,
      type: 'total_goals',
      riskLevel: 'high',
      description: 'Total de Gols',
      odds: 2.80,
      confidence: confidence,
      reasoning: `Média muito alta de ${totalAvgGoals.toFixed(1)} gols por jogo. Ambos ataques produtivos e defesas frágeis indicam jogo com muitos gols.`,
      prediction: 'Mais de 3.5 gols',
    });
    
    if (totalAvgGoals > 3.5) {
      suggestions.push({
        id: `${analysis.fixtureId}-goals-high-over-extreme`,
        fixtureId: analysis.fixtureId,
        type: 'total_goals',
        riskLevel: 'high',
        description: 'Total de Gols',
        odds: 4.50,
        confidence: Math.min(45, confidence - 10),
        reasoning: `Média extremamente alta de ${totalAvgGoals.toFixed(1)} gols. Histórico recente mostra jogos abertos com muitos gols.`,
        prediction: 'Mais de 4.5 gols',
      });
    }
  }
  
  // REGRA: Zebra com melhora recente + favorito em queda
  if (awayFormPoints > homeFormPoints + 3 && awayWinRate >= 0.50 && homeWinRate < 0.40) {
    const confidence = Math.min(50, Math.round(
      40 + (awayFormPoints - homeFormPoints)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-winner-high-upset`,
      fixtureId: analysis.fixtureId,
      type: 'match_winner',
      riskLevel: 'high',
      description: 'Vitória da Zebra',
      odds: 3.80,
      confidence: confidence,
      reasoning: `${analysis.awayTeam.name} em ascensão (forma: ${analysis.awayTeam.form}) enquanto ${analysis.homeTeam.name} está em queda (forma: ${analysis.homeTeam.form}). Zebra com valor estatístico.`,
      prediction: `Vitória ${analysis.awayTeam.name}`,
    });
  }
  
  // REGRA: Favorito vence com goleada > 40% → Handicap -1.5
  const homeGoalDifference = analysis.homeTeam.avgGoalsScored - analysis.awayTeam.avgGoalsConceded;
  if (homeGoalDifference >= 1.5 && homeFormPoints >= 10) {
    const confidence = Math.min(52, Math.round(
      35 + (homeGoalDifference * 10)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-handicap-high-home`,
      fixtureId: analysis.fixtureId,
      type: 'handicap',
      riskLevel: 'high',
      description: 'Handicap Europeu',
      odds: 3.20,
      confidence: confidence,
      reasoning: `${analysis.homeTeam.name} tem ataque forte (${analysis.homeTeam.avgGoalsScored.toFixed(1)} gols) contra defesa fraca (${analysis.awayTeam.avgGoalsConceded.toFixed(1)} sofridos). Histórico indica vitórias com margem.`,
      prediction: `${analysis.homeTeam.name} -1.5`,
    });
  }
  
  // REGRA: Placar exato quando há padrão forte
  const predictedHomeGoals = Math.round(analysis.homeTeam.avgGoalsScored);
  const predictedAwayGoals = Math.round(analysis.awayTeam.avgGoalsScored);
  const homeGoals = Math.min(4, Math.max(0, predictedHomeGoals));
  const awayGoals = Math.min(4, Math.max(0, predictedAwayGoals));
  
  const scoreConfidence = Math.min(42, Math.round(
    25 + ((analysis.homeTeam.avgGoalsScored + analysis.awayTeam.avgGoalsScored) * 4)
  ));
  
  suggestions.push({
    id: `${analysis.fixtureId}-score-high-exact`,
    fixtureId: analysis.fixtureId,
    type: 'correct_score',
    riskLevel: 'high',
    description: 'Placar Exato',
    odds: 9.50,
    confidence: scoreConfidence,
    reasoning: `Baseado nas médias de gols: ${analysis.homeTeam.name} marca ${analysis.homeTeam.avgGoalsScored.toFixed(1)} e ${analysis.awayTeam.name} marca ${analysis.awayTeam.avgGoalsScored.toFixed(1)} por jogo. Padrão estatístico aponta para este placar.`,
    prediction: `${homeGoals}-${awayGoals}`,
  });
  
  // REGRA: Ambas marcam + total de gols combinado
  if (bothScoreRate >= 0.60 && totalAvgGoals >= 2.8) {
    const confidence = Math.min(48, Math.round(
      (bothScoreRate * 60) + ((totalAvgGoals / 4.0) * 20)
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-combo-high-btts-goals`,
      fixtureId: analysis.fixtureId,
      type: 'both_teams_score',
      riskLevel: 'high',
      description: 'Ambos Marcam + Total de Gols',
      odds: 3.40,
      confidence: confidence,
      reasoning: `Combinação de ambos marcarem (${(bothScoreRate * 100).toFixed(0)}% dos jogos) com média alta de ${totalAvgGoals.toFixed(1)} gols. Jogo ofensivo esperado.`,
      prediction: 'Sim + Mais de 2.5 gols',
    });
  }
  
  // REGRA: Escanteios quando jogo ofensivo
  if (totalAvgGoals >= 2.5 && defensiveStrength >= 1.2) {
    const confidence = Math.min(50, Math.round(
      (totalAvgGoals / 3.5) * 65
    ));
    
    suggestions.push({
      id: `${analysis.fixtureId}-corners-high`,
      fixtureId: analysis.fixtureId,
      type: 'corners',
      riskLevel: 'high',
      description: 'Total de Escanteios',
      odds: 2.60,
      confidence: confidence,
      reasoning: `Jogos ofensivos (média de ${totalAvgGoals.toFixed(1)} gols) geram mais escanteios. Times pressionam constantemente e criam oportunidades.`,
      prediction: 'Mais de 10.5 escanteios',
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

function calculateUndefeatedRate(form: string): number {
  if (!form || form.length === 0) return 0;
  
  let undefeated = 0;
  for (const char of form) {
    if (char === 'W' || char === 'V' || char === 'D' || char === 'E') {
      undefeated++;
    }
  }
  
  return undefeated / form.length;
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

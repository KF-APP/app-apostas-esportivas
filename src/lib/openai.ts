import OpenAI from 'openai';

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Necessário para uso no cliente
});

export interface BettingSuggestion {
  risk: 'baixo' | 'médio' | 'alto';
  bet: string;
  confidence: string;
  reasoning: string;
}

export interface HistoricalData {
  homeTeam: string;
  awayTeam: string;
  homeStats: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    form: string;
  };
  awayStats: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    form: string;
  };
  h2h: Array<{
    date: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
  }>;
}

export async function generateBettingSuggestions(
  historicalData: HistoricalData
): Promise<BettingSuggestion[]> {
  try {
    const prompt = `
Você é um especialista em apostas esportivas. Analise os dados históricos abaixo e sugira 3 apostas DIFERENTES (uma para cada nível de risco):

**Time da Casa:** ${historicalData.homeTeam}
- Vitórias: ${historicalData.homeStats.wins}
- Empates: ${historicalData.homeStats.draws}
- Derrotas: ${historicalData.homeStats.losses}
- Gols Marcados: ${historicalData.homeStats.goalsFor}
- Gols Sofridos: ${historicalData.homeStats.goalsAgainst}
- Forma recente: ${historicalData.homeStats.form}

**Time Visitante:** ${historicalData.awayTeam}
- Vitórias: ${historicalData.awayStats.wins}
- Empates: ${historicalData.awayStats.draws}
- Derrotas: ${historicalData.awayStats.losses}
- Gols Marcados: ${historicalData.awayStats.goalsFor}
- Gols Sofridos: ${historicalData.awayStats.goalsAgainst}
- Forma recente: ${historicalData.awayStats.form}

**Histórico de Confrontos Diretos:**
${historicalData.h2h.map(match => `${match.date}: ${match.homeTeam} ${match.score} ${match.awayTeam}`).join('\n')}

**REGRAS IMPORTANTES:**
1. Cada aposta deve ser ÚNICA e DIFERENTE das outras
2. Aposta Conservadora (baixo risco): Apostas mais seguras com alta probabilidade (ex: Dupla Chance, Resultado Final mais provável)
3. Aposta de Risco Médio: Apostas com probabilidade moderada (ex: Ambos Marcam, Total de Gols)
4. Aposta de Alto Risco: Apostas específicas com maior retorno (ex: Placar Exato, Handicap)
5. Cada sugestão deve ter uma justificativa clara baseada nos dados

Responda APENAS com um JSON válido no seguinte formato:
{
  "suggestions": [
    {
      "risk": "baixo",
      "bet": "Descrição da aposta conservadora",
      "confidence": "XX%",
      "reasoning": "Justificativa baseada nos dados"
    },
    {
      "risk": "médio",
      "bet": "Descrição da aposta de risco médio",
      "confidence": "XX%",
      "reasoning": "Justificativa baseada nos dados"
    },
    {
      "risk": "alto",
      "bet": "Descrição da aposta de alto risco",
      "confidence": "XX%",
      "reasoning": "Justificativa baseada nos dados"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em apostas esportivas. Sua tarefa é analisar dados históricos de jogos e sugerir apostas estratégicas para os usuários com base em diferentes níveis de risco. Sempre responda com JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('Resposta vazia da OpenAI');
    }

    const parsed = JSON.parse(response);
    return parsed.suggestions || [];
  } catch (error) {
    console.error('Erro ao gerar sugestões com OpenAI:', error);
    throw error;
  }
}
